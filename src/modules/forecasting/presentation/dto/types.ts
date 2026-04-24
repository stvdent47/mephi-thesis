import { Type } from "@sinclair/typebox";

export const PredictionItemDto = Type.Object({
	period: Type.String(),
	predicted: Type.Number(),
});

export const CategoryForecastItemDto = Type.Object({
	id: Type.String(),
	name: Type.String(),
	predictions: Type.Array(PredictionItemDto),
});

export const HistoricalItemDto = Type.Object({
	period: Type.String(),
	actual: Type.Number(),
});

export const AccuracyMetricsDto = Type.Object({
	mae: Type.Number(),
	rmse: Type.Number(),
	mape: Type.Number(),
});
