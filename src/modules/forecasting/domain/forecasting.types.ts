export const enum ForecastingMethod {
	SMA = 'sma',
	LSTM = 'lstm',
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
	parameters: { windowSize: number };
	totalForecast: PredictionItem[];
	categoryForecasts: CategoryForecastItem[];
	historicalData: HistoricalItem[];
	accuracy?: AccuracyMetrics;
}

// LSTM
export interface LSTMForecastQuery extends ForecastQuery {
	epochs: number;
	lookback: number;
}

export interface LSTMForecastResult {
	method: ForecastingMethod.LSTM;
	parameters: { lookback: number; epochs: number; trainingLoss: number };
	totalForecast: PredictionItem[];
	categoryForecasts: CategoryForecastItem[];
	historicalData: HistoricalItem[];
	accuracy?: AccuracyMetrics;
}
