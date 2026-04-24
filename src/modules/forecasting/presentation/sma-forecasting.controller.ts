import type { FastifyPluginAsync } from 'fastify';
import { SMAForecastQueryDto, SMAForecastResponseDto, type SMAForecastQueryDtoType } from './dto/sma-forecast.dto.js';
import type { ISMAForecastingService } from '../application/ports/sma-forecasting-service.port.js';

export const smaForecastingController = (smaService: ISMAForecastingService): FastifyPluginAsync =>
	async (app) => {
		app.get<{ Querystring: SMAForecastQueryDtoType }>(
			'/',
			{
				preHandler: [app.authenticate],
				schema: {
					querystring: SMAForecastQueryDto,
					response: { 200: SMAForecastResponseDto },
				},
			},
			async (request) => {
				const { windowSize = 3, forecastPeriods = 3, categoryId = null } = request.query;
				// const { months = null, forecastPeriods = null, categoryId = null } = request.query;

				return smaService.forecast(
					request.user.id,
					{
						// ...(months !== null ? { months } : {}),
						// ...(forecastPeriods !== null ? { forecastPeriods } : {}),
						// ...(categoryId !== null ? { categoryId } : {}),
						windowSize,
						forecastPeriods,
						categoryId,
					}
				);
			},
		);
	};
