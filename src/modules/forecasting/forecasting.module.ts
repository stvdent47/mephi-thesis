import type { FastifyInstance } from 'fastify';

import { SMAForecastingService } from './infrastructure/sma/sma-forecasting.service.js';
import { smaForecastingController } from './presentation/sma-forecasting.controller.js';

export const forecastingModule = async (app: FastifyInstance) => {
	const aggregationService = app.aggregationService;

	const smaService = new SMAForecastingService(aggregationService);

	await app.register(smaForecastingController(smaService), { prefix: '/api/forecast/sma' });
};
