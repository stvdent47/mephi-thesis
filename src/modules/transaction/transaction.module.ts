import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { TransactionService } from './application/transaction.service.js';
import { PrismaTransactionRepository } from './infrastructure/prisma-transaction.repository.js';
import { transactionController } from './presentation/transaction.controller.js';

export const transactionModule: FastifyPluginAsync = async (app: FastifyInstance) => {
	const transactionRepository = new PrismaTransactionRepository(app.prisma);
	const transactionService = new TransactionService(transactionRepository);

	await app.register(transactionController(transactionService), { prefix: '/api/transactions' });
};
