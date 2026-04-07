import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from "fastify";
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export const swaggerPlugin: FastifyPluginAsync = fp(async (fastify) => {
	await fastify.register(
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

	await fastify.register(
		fastifySwaggerUi,
		{ routePrefix: '/docs' },
	);
});
