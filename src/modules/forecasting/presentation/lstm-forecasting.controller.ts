import type { FastifyPluginAsync } from 'fastify';
import { LSTMForecastQueryDto, LSTMForecastResponseDto, type LSTMForecastQueryDtoType } from './dto/lstm-forecast.dto.js';
import type { ILSTMForecastingService } from '../application/ports/lstm-forecasting-service.port.js';
import { AppError } from '../../../shared/errors/app.error.js';

export const lstmForecastingController = (lstmService: ILSTMForecastingService): FastifyPluginAsync =>
	async (app) => {
		app.get<{ Querystring: LSTMForecastQueryDtoType }>(
			'/',
			{
				preHandler: [app.authenticate],
				schema: {
					querystring: LSTMForecastQueryDto,
					response: { 200: LSTMForecastResponseDto },
				},
			},
			async (request) => {
				const {
					windowSize = 12,
					forecastPeriods = 3,
					categoryId = null,
					lookback = 3,
					epochs = 100,
				} = request.query;

				if (lookback > windowSize) {
					throw new AppError(400, 'lookback must not exceed windowSize.');
				}

				return lstmService.forecast(
					request.user.id,
					{
						windowSize,
						forecastPeriods,
						categoryId,
						lookback,
						epochs,
					}
				);
			},
		);
	};
