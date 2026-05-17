import { parentPort } from 'node:worker_threads';
import * as tf from '@tensorflow/tfjs';

interface NormalizedData {
	normalized: number[];
	min: number;
	max: number;
}

interface Sequences {
	xs: number[][][];
	ys: number[][];
}

interface WorkerInput {
	data: number[];
	lookback: number;
	epochs: number;
	forecastPeriods: number;
}

export interface WorkerOutput {
	predictions: number[] | null;
	trainingLoss: number | null;
	error: string | null;
}

function minMaxNormalize(values: number[]): NormalizedData {
	const min = Math.min(...values);
	const max = Math.max(...values);
	const range = max - min;
	const normalized = range === 0
		? values.map(() => 0)
		: values.map((v) => (v - min) / range);

	return { normalized, min, max };
}

function denormalize(value: number, min: number, max: number): number {
	return value * (max - min) + min;
}

function createSequences(data: number[], lookback: number): Sequences {
	const xs: number[][][] = [];
	const ys: number[][] = [];

	for (let i = lookback; i < data.length; i++) {
		const seq = data.slice(i - lookback, i).map((v) => [v]);
		xs.push(seq);
		ys.push([data[i] ?? 0]);
	}

	return { xs, ys };
}

// TODO: move to LSTM adapter class
async function runLSTM({ data, lookback, epochs, forecastPeriods }: WorkerInput): Promise<WorkerOutput> {
	const { normalized, min, max } = minMaxNormalize(data);
	const { xs: xsData, ys: ysData } = createSequences(normalized, lookback);

	if (xsData.length === 0) {
		return {
			predictions: null,
			trainingLoss: null,
			error: 'Not enough data to create sequences after applying lookback window.',
		};
	}

	const xsTensor = tf.tensor3d(xsData, [xsData.length, lookback, 1]);
	const ysTensor = tf.tensor2d(ysData, [ysData.length, 1]);

	const model = tf.sequential();
	model.add(tf.layers.lstm({ units: 50, inputShape: [lookback, 1], returnSequences: false }));
	model.add(tf.layers.dense({ units: 1 }));
	model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

	const history = await model.fit(
		xsTensor,
		ysTensor,
		{
			epochs,
			batchSize: 1,
			verbose: 0,
		},
	);

	xsTensor.dispose();
	ysTensor.dispose();

	const lossHistory = history.history['loss'] as number[];
	const trainingLoss = lossHistory[lossHistory.length - 1] ?? 0;

	const windowData = normalized.slice(-lookback);
	const predictions: number[] = [];

	for (let i = 0; i < forecastPeriods; i++) {
		const inputSeq = windowData.slice(-lookback).map((v) => [v]);
		const inputTensor = tf.tensor3d([inputSeq], [1, lookback, 1]);
		const outputTensor = model.predict(inputTensor) as tf.Tensor;
		const predictedNorm = (await outputTensor.data())[0] ?? 0;
		inputTensor.dispose();
		outputTensor.dispose();

		const predicted = denormalize(predictedNorm, min, max);
		predictions.push(predicted);
		windowData.push(predictedNorm);
	}

	model.dispose();

	return {
		predictions,
		trainingLoss,
		error: null,
	};
}

if (parentPort === null) {
	throw new Error('This file must be run as a worker thread');
}

parentPort.on('message', (input: WorkerInput) => {
	runLSTM(input)
		.then((result) => {
			if (parentPort !== null) {
				parentPort.postMessage(result);
			}
		})
		.catch((error: unknown) => {
			if (parentPort !== null) {
				parentPort.postMessage({
					predictions: null,
					trainingLoss: null,
					error: error instanceof Error ? error.message : String(error),
				});
			}
		});
});
