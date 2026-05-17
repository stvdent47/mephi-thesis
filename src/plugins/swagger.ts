import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from "fastify";
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { env, NODE_ENV } from '../config/env.js';

export const swaggerPlugin: FastifyPluginAsync = fp(async (app) => {
	if (env.NODE_ENV === NODE_ENV.Production) {
		app.log.info('Skipping Swagger registration in production environment');
		return;
	}

	await app.register(
		fastifySwagger,
		{
			openapi: {
				openapi: '3.0.0',
				info: {
					title: 'Finance API',
					version: '1.0.0',
					description:
						'Financial operations accounting and expense forecasting system',
				},
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
			},
		},
	);

	await app.register(
		fastifySwaggerUi,
		{ routePrefix: '/docs' },
	);
});
