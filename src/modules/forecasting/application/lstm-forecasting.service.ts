import { Worker } from 'node:worker_threads';
import type { IAggregationService } from '../../aggregation/application/aggregation-service.port.js';
import { AppError } from '../../../shared/errors/app.error.js';
import { buildFuturePeriods } from '../domain/forecasting.utils.js';
import { type PredictionItem, type HistoricalItem, type CategoryForecastItem, type AccuracyMetrics, type LSTMForecastResult, type LSTMForecastQuery, ForecastingMethod } from '../domain/forecasting.types.js';
import type { ILSTMForecastingService } from './ports/lstm-forecasting-service.port.js';
import type { WorkerOutput } from '../infrastructure/lstm/lstm.worker.js';

interface WorkerResult extends WorkerOutput { }

interface CategoryEntry {
	name: string;
	totals: number[];
}

function runWorker(
	data: number[],
	lookback: number,
	epochs: number,
	forecastPeriods: number,
): Promise<WorkerResult> {
	return new Promise((resolve, reject) => {
		const worker = new Worker(
			// new URL('./lstm.worker.ts', import.meta.url),
			new URL('../infrastructure/lstm/lstm.worker.ts', import.meta.url),
			{
				execArgv: ['--import', 'tsx'],
			}
		);

		// const timer = setTimeout(() => {
		// void worker.terminate();
		// reject(new AppError(504, 'LSTM worker timed out after 60 seconds.'));
		// }, 60_000);
		// }, 60_000);

		worker.postMessage({ data, lookback, epochs, forecastPeriods });

		worker
			.on('message', (result: WorkerResult) => {
				// clearTimeout(timer);
				resolve(result);
			})
			.on('error', (err) => {
				// clearTimeout(timer);
				reject(err);
			})
			.on('exit', (code) => {
				if (code !== 0) {
					// clearTimeout(timer);
					reject(
						new AppError(500, `LSTM worker exited with code ${code}`)
					);
				}
			});
	});
}

async function computeAccuracy(
	values: number[],
	lookback: number,
	epochs: number,
	forecastPeriods: number,
): Promise<AccuracyMetrics | null> {
	if (values.length <= forecastPeriods) {
		return null;
	}

	const trainLength = values.length - forecastPeriods;
	if (trainLength < lookback + 1) {
		return null;
	}

	const trainValues = values.slice(0, trainLength);
	const actualValues = values.slice(trainLength);

	const holdoutResult = await runWorker(trainValues, lookback, epochs, forecastPeriods);
	if (holdoutResult.predictions === null || holdoutResult.error !== null) {
		return null;
	}

	const predicted = holdoutResult.predictions;
	const n = Math.min(actualValues.length, predicted.length);

	let sumAbsError = 0;
	let sumSquaredError = 0;
	let sumAbsPercentError = 0;
	let mapeCount = 0;

	for (let i = 0; i < n; i++) {
		const actualValue = actualValues[i] ?? 0;
		const predictedValue = predicted[i] ?? 0;
		const error = actualValue - predictedValue;

		sumAbsError += Math.abs(error);
		sumSquaredError += error * error;

		if (actualValue !== 0) {
			sumAbsPercentError += Math.abs(error / actualValue) * 100;
			mapeCount++;
		}
	}

	return {
		mae: sumAbsError / n,
		rmse: Math.sqrt(sumSquaredError / n),
		mape: mapeCount > 0 ? sumAbsPercentError / mapeCount : 0,
	};
}

export class LSTMForecastingService implements ILSTMForecastingService {
	constructor(
		private readonly aggregationService: IAggregationService,
	) { }

	public async forecast(userId: string, options: LSTMForecastQuery): Promise<LSTMForecastResult> {
		const {
			windowSize,
			forecastPeriods,
			categoryId,
			lookback,
			epochs,
		} = options;

		const trendData = await this.aggregationService.getMonthlyTrend(
			userId,
			Math.max(windowSize, lookback) + forecastPeriods,
		);
		if (trendData.length < lookback + 1) {
			throw new AppError(400, `Insufficient data for LSTM forecast: at least ${lookback + 1} months of data are required.`);
		}

		const lastTrend = trendData[trendData.length - 1];
		if (lastTrend === undefined) {
			throw new AppError(400, `Insufficient data for LSTM forecast: at least ${lookback + 1} months of data are required.`);
		}

		const lastPeriod = lastTrend.period;
		const futurePeriods = buildFuturePeriods(lastPeriod, forecastPeriods);
		const historicalData: HistoricalItem[] = trendData.map((entry) =>
			({ period: entry.period, actual: entry.totalExpense }));
		const expenseTotals = trendData.map((e) => e.totalExpense);

		const { predictions, trainingLoss, error } = await runWorker(expenseTotals, lookback, epochs, forecastPeriods);
		if (predictions === null || trainingLoss === null || error !== null) {
			throw new AppError(500, `LSTM worker error: ${error}`);
		}

		const totalForecast: PredictionItem[] = futurePeriods.map((period, i) => ({ period, predicted: predictions[i] ?? 0 }));
		const categoryForecasts: CategoryForecastItem[] = [];

		if (categoryId !== null) {
			const categoryTotals: number[] = [];
			let categoryName = '';

			for (const trendEntry of trendData) {
				const category = trendEntry.categories.find(({ id }) => id === categoryId);
				categoryTotals.push(category ? category.total : 0);
				if (category !== undefined) {
					categoryName = category.name;
				}
			}

			if (categoryTotals.length >= lookback + 1) {
				if (categoryTotals.some((v) => v > 0)) {
					const categoryWorkerResult = await runWorker(categoryTotals, lookback, epochs, forecastPeriods);
					if (
						categoryWorkerResult.predictions !== null &&
						categoryWorkerResult.error === null
					) {
						categoryForecasts.push({
							id: categoryId,
							name: categoryName,
							predictions: futurePeriods.map((period, i) => ({ period, predicted: categoryWorkerResult.predictions?.[i] ?? 0 })),
						});
					}
				} else {
					categoryForecasts.push({
						id: categoryId,
						name: categoryName,
						predictions: futurePeriods.map((period) => ({ period, predicted: 0 })),
					});
				}
			}
		} else {
			const allCategories = new Map<string, CategoryEntry>();

			for (let i = 0; i < trendData.length; i++) {
				const trendEntry = trendData[i];
				if (trendEntry === undefined) {
					continue;
				}

				for (const category of trendEntry.categories) {
					if (!allCategories.has(category.id)) {
						allCategories.set(category.id, { name: category.name, totals: new Array(trendData.length).fill(0) });
					}

					const entry = allCategories.get(category.id);
					if (entry !== undefined) {
						entry.totals[i] = category.total;
					}
				}
			}

			// for (const [id, { name, totals }] of allCategories) {
			// 	if (totals.length >= lookback + 1) {
			// 		const categoryWorkerResult = await runWorker(totals, lookback, epochs, forecastPeriods);
			// 		if (
			// 			categoryWorkerResult.predictions !== null &&
			// 			categoryWorkerResult.error === null
			// 		) {
			// 			categoryForecasts.push({
			// 				id,
			// 				name,
			// 				predictions: futurePeriods.map((period, i) => ({ period, predicted: categoryWorkerResult.predictions?.[i] ?? 0 })),
			// 			});
			// 		}
			// 	}
			// }
			const categoryPromises: Promise<CategoryForecastItem | null>[] = Array.from(allCategories.entries())
				.filter(([, { totals }]) => totals.length >= lookback + 1)
				.map(async ([id, { name, totals }]) => {
					const categoryWorkerResult = await runWorker(totals, lookback, epochs, forecastPeriods);
					if (
						categoryWorkerResult.predictions !== null &&
						categoryWorkerResult.error === null
					) {
						return {
							id,
							name,
							predictions: futurePeriods.map((period, i) => ({ period, predicted: categoryWorkerResult.predictions?.[i] ?? 0 })),
						}
					}
					return null;
				});

			const categoryResults = await Promise.all(categoryPromises);
			for (const result of categoryResults) {
				if (result !== null) {
					categoryForecasts.push(result);
				}
			}
		}

		const accuracy = await computeAccuracy(expenseTotals, lookback, epochs, forecastPeriods);

		return {
			method: ForecastingMethod.LSTM,
			parameters: { lookback, epochs, trainingLoss },
			totalForecast,
			categoryForecasts,
			historicalData,
			...(accuracy !== null ? { accuracy } : {}),
		};
	}
}
