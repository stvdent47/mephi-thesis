import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { AccountService } from './application/account.service.js';
import { PrismaAccountRepository } from './infrastructure/prisma-account.repository.js';
import { accountController } from './presentation/account.controller.js';

export const accountsModule: FastifyPluginAsync = async (app: FastifyInstance) => {
	const accountRepository = new PrismaAccountRepository(app.prisma);
	const accountService = new AccountService(accountRepository);

	await app.register(accountController(accountService), { prefix: '/api/accounts' });
};
