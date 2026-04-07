import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import { swaggerPlugin } from './plugins/swagger.js';

export async function buildApp(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
	const app = Fastify({
		logger: true,
		...opts,
	});

	await app.register(swaggerPlugin);

	app.get('/health', async () => {
		return { status: 'ok' };
	});

	return app;
}
