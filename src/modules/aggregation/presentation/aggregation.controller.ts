import type { FastifyPluginAsync } from 'fastify';

import type { IAggregationService } from '../application/aggregation-service.port.js';
import { AggregationQueryDto, AggregationResponseDto, type AggregationQueryDtoType } from './dto/aggregation.dto.js';
import { CategorySummaryQueryDto, CategorySummaryResponseDto, type CategorySummaryQueryDtoType } from './dto/category-summary.dto.js';
import { MonthlyTrendQueryDto, MonthlyTrendResponseDto, type MonthlyTrendQueryDtoType } from './dto/monthly-trend.dto.js';

export const aggregationController = (aggregationService: IAggregationService): FastifyPluginAsync =>
	async (app) => {
		app.get<{ Querystring: AggregationQueryDtoType }>(
			'/api/aggregation',
			{
				preHandler: [app.authenticate],
				schema: {
					querystring: AggregationQueryDto,
					response: { 200: AggregationResponseDto },
				},
			},
			async (request) => {
				const { from, to, groupBy, accountId = null } = request.query;
				return aggregationService.getAggregatedData(request.user.id, { from, to, groupBy, accountId });
			},
		);

		app.get<{ Querystring: CategorySummaryQueryDtoType }>(
			'/api/aggregation/by-category',
			{
				preHandler: [app.authenticate],
				schema: {
					querystring: CategorySummaryQueryDto,
					response: { 200: CategorySummaryResponseDto },
				},
			},
			async (request) => {
				const { from, to } = request.query;
				return aggregationService.getCategorySummary(request.user.id, from, to);
			},
		);

		app.get<{ Querystring: MonthlyTrendQueryDtoType }>(
			'/api/aggregation/monthly-trend',
			{
				preHandler: [app.authenticate],
				schema: {
					querystring: MonthlyTrendQueryDto,
					response: { 200: MonthlyTrendResponseDto },
				},
			},
			async (request) => {
				const { months = 12 } = request.query;
				return aggregationService.getMonthlyTrend(request.user.id, months);
			},
		);
	};
