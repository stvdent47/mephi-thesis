import fp from 'fastify-plugin';
import type { FastifyInstance } from "fastify";

import { AppError } from "../shared/errors/app.error.js";
import { Prisma } from '../generated/prisma/client.js';

export const errorHandlerPlugin = fp(async (app: FastifyInstance) => {
	app.setErrorHandler(async (error, _request, reply) => {
		if (error instanceof AppError) {
			return reply.status(error.statusCode).send({
				statusCode: error.statusCode,
				error: error.name,
				message: error.message,
			});
		}

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return reply.status(409).send({
					statusCode: 409,
					error: 'ConflictError',
					message: 'A record with this value already exists',
				});
			}

			if (error.code === 'P2025') {
				return reply.status(404).send({
					statusCode: 404,
					error: 'NotFoundError',
					message: 'Record not found',
				});
			}
		}

		if (error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number') {
			return reply.status(error.statusCode).send({
				statusCode: error.statusCode,
				error: error.name || 'Error',
				message: error.message,
			});
		}

		app.log.error(error);

		return reply.status(500).send({
			statusCode: 500,
			error: 'InternalServerError',
			message: 'An internal server error occurred',
		});
	});
});
