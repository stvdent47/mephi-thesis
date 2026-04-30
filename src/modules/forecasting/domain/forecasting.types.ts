export const enum ForecastingMethod {
	SMA = 'sma',
}

export interface PredictionItem {
	period: string;
	predicted: number;
}

export interface CategoryForecastItem {
	id: string;
	name: string;
	predictions: PredictionItem[];
}

export interface HistoricalItem {
	period: string;
	actual: number;
}

export interface AccuracyMetrics {
	mae: number;
	rmse: number;
	mape: number;
}

interface ForecastQuery {
	windowSize: number;
	forecastPeriods: number;
	categoryId: string | null;
}

// SMA
export interface SMAForecastQuery extends ForecastQuery { }

export interface SMAForecastResult {
	method: ForecastingMethod.SMA;
	parameters: { windowSize: number; };
	totalForecast: PredictionItem[];
	categoryForecasts: CategoryForecastItem[];
	historicalData: HistoricalItem[];
	accuracy?: AccuracyMetrics;
}
