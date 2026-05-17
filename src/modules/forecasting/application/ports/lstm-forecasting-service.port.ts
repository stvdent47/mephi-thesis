import type { LSTMForecastQuery, LSTMForecastResult } from "../../domain/forecasting.types.js";

export interface ILSTMForecastingService {
	forecast(userId: string, options: LSTMForecastQuery): Promise<LSTMForecastResult>;
}
