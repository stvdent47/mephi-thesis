import { Type, type Static } from '@sinclair/typebox';
import { AccuracyMetricsDto, CategoryForecastItemDto, HistoricalItemDto, PredictionItemDto } from './types.js';
import { ForecastingMethod } from '../../domain/forecasting.types.js';

// TODO: add `withAccuracy` parameter to allow clients to request accuracy metrics only when needed, as it requires additional computation and can increase response time significantly
export const LSTMForecastQueryDto = Type.Object({
	windowSize: Type.Optional(Type.Integer({ minimum: 4, maximum: 48, default: 12 })),
	forecastPeriods: Type.Optional(Type.Integer({ minimum: 1, maximum: 12, default: 3 })),
	categoryId: Type.Optional(Type.String({ format: 'uuid' })),
	// lookback: Type.Optional(Type.Integer({ minimum: 2, maximum: 6, default: 3 })),
	lookback: Type.Optional(Type.Integer({ minimum: 6, maximum: 24, default: 12 })),
	epochs: Type.Optional(Type.Integer({ minimum: 5, maximum: 500, default: 100 })),
});
export type LSTMForecastQueryDtoType = Static<typeof LSTMForecastQueryDto>;

export const LSTMForecastResponseDto = Type.Object({
	method: Type.Literal(ForecastingMethod.LSTM),
	parameters: Type.Object({
		lookback: Type.Number(),
		epochs: Type.Number(),
		trainingLoss: Type.Number(),
	}),
	totalForecast: Type.Array(PredictionItemDto),
	categoryForecasts: Type.Array(CategoryForecastItemDto),
	historicalData: Type.Array(HistoricalItemDto),
	accuracy: Type.Optional(AccuracyMetricsDto),
});
export type LSTMForecastResponseDtoType = Static<typeof LSTMForecastResponseDto>;
