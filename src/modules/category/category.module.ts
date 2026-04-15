import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { CategoryService } from './application/category.service.js';
import { PrismaCategoryRepository } from './infrastructure/prisma-category.repository.js';
import { categoryController } from './presentation/category.controller.js';

export const categoryModule: FastifyPluginAsync = async (app: FastifyInstance) => {
	const categoryRepository = new PrismaCategoryRepository(app.prisma);
	const categoryService = new CategoryService(categoryRepository);

	await app.register(categoryController(categoryService), { prefix: '/api/categories' });
};
