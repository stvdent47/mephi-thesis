import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { AuthService } from './application/auth.service.js';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher.js';
import { FastifyJwtTokenService } from './infrastructure/fastify-jwt-token.service.js';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository.js';
import { authController } from './presentation/auth.controller.js';
import { createAuthGuard } from './presentation/auth.guard.js';

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: (request: FastifyRequest) => Promise<void>;
	}
}

export const authModule: FastifyPluginAsync = fp(async (app: FastifyInstance) => {
	const passwordHasher = new BcryptPasswordHasher();
	const tokenService = new FastifyJwtTokenService(app.jwt);
	const userRepository = new PrismaUserRepository(app.prisma);
	const authService = new AuthService(passwordHasher, tokenService, userRepository);

	const authenticate = createAuthGuard(tokenService);
	app.decorate('authenticate', authenticate);

	await app.register(authController(authService), { prefix: '/api/auth' });
});
