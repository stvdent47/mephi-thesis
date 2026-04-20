import { ConflictError, NotFoundError } from '../../../shared/errors/errors.js';
import type { TransactionType } from '../../../generated/prisma/enums.js';
import type { ICategoryRepository } from '../domain/ports/category-repository.port.js';
import type {
	CreateCategoryCommand,
	CreateCategoryResult,
	DeleteCategoryResult,
	FindAllCategoriesResult,
	FindCategoryByIdResult,
	UpdateCategoryCommand,
	UpdateCategoryResult,
} from '../domain/category.types.js';
import type { ICategoryService } from './category-service.port.js';

export class CategoryService implements ICategoryService {
	constructor(
		private readonly categoryRepository: ICategoryRepository,
	) { }

	public async create(userId: string, command: CreateCategoryCommand): Promise<CreateCategoryResult> {
		const { name, type, icon = null, color = null } = command;

		return this.categoryRepository.create(userId, { name, type, icon, color });
	}

	public async findAll(userId: string, type?: TransactionType): Promise<FindAllCategoriesResult> {
		const data = await this.categoryRepository.findAll(userId, type);

		return { data };
	}

	public async findById(userId: string, categoryId: string): Promise<FindCategoryByIdResult> {
		const category = await this.categoryRepository.findById(userId, categoryId);
		if (category === null) {
			throw new NotFoundError('Category was not found');
		}

		return category;
	}

	public async update(userId: string, categoryId: string, command: UpdateCategoryCommand): Promise<UpdateCategoryResult> {
		const category = await this.categoryRepository.update(userId, categoryId, command);
		if (category === null) {
			throw new NotFoundError('Category was not found');
		}

		return category;
	}

	public async delete(userId: string, categoryId: string): Promise<DeleteCategoryResult> {
		const existing = await this.categoryRepository.findById(userId, categoryId);
		if (existing === null) {
			throw new NotFoundError('Category was not found');
		}

		const transactionCount = await this.categoryRepository.countTransactions(categoryId);
		if (transactionCount > 0) {
			throw new ConflictError('Category has transactions — archive or reassign first');
		}

		const category = await this.categoryRepository.delete(userId, categoryId);
		if (category === null) {
			throw new NotFoundError('Category was not found');
		}

		return category;
	}
}
