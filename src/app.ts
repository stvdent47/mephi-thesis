import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { env } from './config/env.js';
import { prismaPlugin } from './plugins/prisma.js';
import { swaggerPlugin } from './plugins/swagger.js';
import { authModule } from './modules/auth/auth.module.js';
import { accountsModule } from './modules/account/account.module.js';
import { errorHandlerPlugin } from './plugins/error-handler.js';

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
	await app.register(accountsModule);

	app.get('/health', async () => {
		return { status: 'ok' };
	});

	return app;
}
