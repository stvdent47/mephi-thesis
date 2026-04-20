import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { PrismaAggregationRepository } from './infrastructure/prisma-aggregation.repository.js';
import { AggregationService } from './application/aggregation.service.js';
import { aggregationController } from './presentation/aggregation.controller.js';
import type { IAggregationService } from './application/aggregation-service.port.js';

declare module 'fastify' {
	interface FastifyInstance {
		aggregationService: IAggregationService;
	}
}

export const aggregationModule = fp(async (app: FastifyInstance) => {
	const aggregationRepository = new PrismaAggregationRepository(app.prisma);
	const aggregationService = new AggregationService(aggregationRepository);

	app.decorate('aggregationService', aggregationService);

	await app.register(aggregationController(aggregationService));
});
