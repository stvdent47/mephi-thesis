import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { swaggerPlugin } from './plugins/swagger.js';

export async function buildApp(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
	const app = Fastify({
		logger: true,
		...opts,
	}).withTypeProvider<TypeBoxTypeProvider>();

	await app.register(fastifyJwt, { secret: env.JWT_SECRET });
	await app.register(fastifyCors, { origin: true });
	await app.register(swaggerPlugin);

	app.get('/health', async () => {
		return { status: 'ok' };
	});

	return app;
}
