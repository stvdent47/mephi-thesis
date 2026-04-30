import { Type, type Static } from '@sinclair/typebox';
import { AccuracyMetricsDto, CategoryForecastItemDto, HistoricalItemDto, PredictionItemDto } from './types.js';
import { ForecastingMethod } from '../../domain/forecasting.types.js';

export const SMAForecastQueryDto = Type.Object({
	windowSize: Type.Optional(Type.Integer({ minimum: 2, maximum: 24, default: 3 })),
	forecastPeriods: Type.Optional(Type.Integer({ minimum: 1, maximum: 12, default: 3 })),
	categoryId: Type.Optional(Type.String({ format: 'uuid' })),
});
export type SMAForecastQueryDtoType = Static<typeof SMAForecastQueryDto>;

export const SMAForecastResponseDto = Type.Object({
	method: Type.Literal(ForecastingMethod.SMA),
	parameters: Type.Object({ windowSize: Type.Number() }),
	totalForecast: Type.Array(PredictionItemDto),
	categoryForecasts: Type.Array(CategoryForecastItemDto),
	historicalData: Type.Array(HistoricalItemDto),
	accuracy: Type.Optional(AccuracyMetricsDto),
});
export type SMAForecastResponseDtoType = Static<typeof SMAForecastResponseDto>;
