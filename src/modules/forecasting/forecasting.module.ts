import type { FastifyInstance } from 'fastify';

import { SMAForecastingService } from './application/sma-forecasting.service.js';
import { LSTMForecastingService } from './application/lstm-forecasting.service.js';
import { smaForecastingController } from './presentation/sma-forecasting.controller.js';
import { lstmForecastingController } from './presentation/lstm-forecasting.controller.js';

export const forecastingModule = async (app: FastifyInstance) => {
	const aggregationService = app.aggregationService;

	const smaService = new SMAForecastingService(aggregationService);
	const lstmService = new LSTMForecastingService(aggregationService);

	await app.register(smaForecastingController(smaService), { prefix: '/api/forecast/sma' });
	await app.register(lstmForecastingController(lstmService), { prefix: '/api/forecast/lstm' });
};
