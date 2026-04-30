import type { IAggregationService } from '../../../aggregation/application/aggregation-service.port.js';
import { AppError } from '../../../../shared/errors/app.error.js';
import { buildFuturePeriods } from '../../domain/forecasting.utils.js';
import { type PredictionItem, type HistoricalItem, type CategoryForecastItem, type AccuracyMetrics, type SMAForecastQuery, type SMAForecastResult, ForecastingMethod } from '../../domain/forecasting.types.js';
import type { ISMAForecastingService } from '../../application/ports/sma-forecasting-service.port.js';

interface CategoryEntry {
	name: string;
	totals: number[];
}

function runSMA(values: number[], windowSize: number, forecastPeriods: number): number[] {
	if (values.length === 0) {
		return new Array(forecastPeriods).fill(0);
	}

	const series = [...values];
	const predictions: number[] = [];

	for (let i = 0; i < forecastPeriods; i++) {
		const window = series.slice(-windowSize);
		const sum = window.reduce((acc, value) => acc + value, 0);
		const predicted = sum / window.length;

		predictions.push(predicted);
		series.push(predicted);
	}

	return predictions;
}

function computeAccuracy(values: number[], windowSize: number, forecastPeriods: number): AccuracyMetrics | null {
	if (values.length <= forecastPeriods) {
		return null;
	}

	const trainLength = values.length - forecastPeriods;
	const trainValues = values.slice(0, trainLength);
	if (trainValues.length < windowSize) {
		return null;
	}

	const actualValues = values.slice(trainLength);
	const predictedValues = runSMA(trainValues, windowSize, forecastPeriods);

	let sumAbsError = 0;
	let sumSquaredError = 0;
	let sumAbsPercentError = 0;
	let mapeCount = 0;

	for (let i = 0; i < forecastPeriods; i++) {
		const actual = actualValues[i] ?? 0;
		const predicted = predictedValues[i] ?? 0;
		const error = actual - predicted;

		sumAbsError += Math.abs(error);
		sumSquaredError += error * error;

		if (actual !== 0) {
			sumAbsPercentError += Math.abs(error / actual) * 100;
			mapeCount++;
		}
	}

	return {
		mae: sumAbsError / forecastPeriods,
		rmse: Math.sqrt(sumSquaredError / forecastPeriods),
		mape: mapeCount > 0 ? sumAbsPercentError / mapeCount : 0,
	};
}

export class SMAForecastingService implements ISMAForecastingService {
	constructor(
		private readonly aggregationService: IAggregationService,
	) { }

	public async forecast(userId: string, query: SMAForecastQuery): Promise<SMAForecastResult> {
		const {
			windowSize,
			forecastPeriods,
			categoryId,
		} = query;

		const trendData = await this.aggregationService.getMonthlyTrend(userId, windowSize + forecastPeriods);
		if (trendData.length < 2) {
			throw new AppError(400, 'Insufficient data for SMA forecast: at least 2 months of data are required.');
		}

		const effectiveWindowSize = Math.min(windowSize, trendData.length);

		const lastTrend = trendData[trendData.length - 1];
		if (lastTrend === undefined) {
			throw new AppError(400, 'Insufficient data for SMA forecast: at least 2 months of data are required.');
		}

		const lastPeriod = lastTrend.period;
		const futurePeriods = buildFuturePeriods(lastPeriod, forecastPeriods);
		const historicalData: HistoricalItem[] = trendData.map((entry) =>
			({ period: entry.period, actual: entry.totalExpense }));
		const expenseTotals = trendData.map(({ totalExpense }) => totalExpense);
		const totalPredictions = runSMA(expenseTotals, effectiveWindowSize, forecastPeriods);
		const totalForecast: PredictionItem[] = futurePeriods.map((period, i) => ({ period, predicted: totalPredictions[i] ?? 0 }));

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

			const predictions = runSMA(categoryTotals, effectiveWindowSize, forecastPeriods);
			categoryForecasts.push({
				id: categoryId,
				name: categoryName,
				predictions: futurePeriods.map((period, i) => ({ period, predicted: predictions[i] ?? 0 })),
			});
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

			for (const [id, { name, totals }] of allCategories) {
				const predictions = runSMA(totals, effectiveWindowSize, forecastPeriods);

				categoryForecasts.push({
					id,
					name,
					predictions: futurePeriods.map((period, i) => ({ period, predicted: predictions[i] ?? 0 })),
				});
			}
		}

		const accuracy = computeAccuracy(expenseTotals, effectiveWindowSize, forecastPeriods);

		return {
			method: ForecastingMethod.SMA,
			parameters: { windowSize: effectiveWindowSize },
			totalForecast,
			categoryForecasts,
			historicalData,
			...(accuracy !== null ? { accuracy } : {}),
		};
	}
}
