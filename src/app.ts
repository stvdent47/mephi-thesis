import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { env } from './config/env.js';
import { prismaPlugin } from './plugins/prisma.js';
import { swaggerPlugin } from './plugins/swagger.js';
import { authModule } from './modules/auth/auth.module.js';
import { accountModule } from './modules/account/account.module.js';
import { categoryModule } from './modules/category/category.module.js';
import { transactionModule } from './modules/transaction/transaction.module.js';
import { errorHandlerPlugin } from './plugins/error-handler.js';
import { aggregationModule } from './modules/aggregation/aggregation.module.js';
import { forecastingModule } from './modules/forecasting/forecasting.module.js';

export async function buildApp(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
	const app = Fastify({
		logger: true,
		...opts,
	}).withTypeProvider<TypeBoxTypeProvider>();

	await app.register(prismaPlugin);
	await app.register(fastifyJwt, { secret: env.JWT_SECRET });
	await app.register(fastifyCors, { origin: true });
	await app.register(swaggerPlugin);
	await app.register(errorHandlerPlugin);

	await app.register(authModule);
	await app.register(accountModule);
	await app.register(categoryModule);
	await app.register(transactionModule);
	await app.register(aggregationModule);
	await app.register(forecastingModule);

	app.get('/health', async () => {
		return { status: 'ok' };
	});

	return app;
}
