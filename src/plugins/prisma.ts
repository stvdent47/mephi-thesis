import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

declare module 'fastify' {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

export const prismaPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
	const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
	const prisma = new PrismaClient({ adapter });

	await prisma.$connect();

	fastify.decorate('prisma', prisma);

	fastify.addHook('onClose', async () => {
		await prisma.$disconnect();
	});
});
