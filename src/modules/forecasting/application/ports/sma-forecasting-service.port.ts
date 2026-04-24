import type { SMAForecastQuery, SMAForecastResult } from "../../domain/forecasting.types.js";

export interface ISMAForecastingService {
	forecast(userId: string, options: SMAForecastQuery): Promise<SMAForecastResult>;
}
