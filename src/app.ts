import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';

export function buildApp(opts: FastifyServerOptions = {}): FastifyInstance {
	const app = Fastify({
		logger: true,
		...opts,
	});

	app.get('/health', async () => {
		return { status: 'ok' };
	});

	return app;
}
