import type { Category, PrismaClient } from '../../../generated/prisma/client.js';
import type { TransactionType } from '../../../generated/prisma/enums.js';
import type { ICategoryRepository } from '../domain/ports/category-repository.port.js';
import type {
	CategoryRecord,
	CreateCategoryInput,
	UpdateCategoryInput,
} from '../domain/category.types.js';

export class PrismaCategoryRepository implements ICategoryRepository {
	constructor(
		private readonly prisma: PrismaClient,
	) { }

	public async create(userId: string, data: CreateCategoryInput): Promise<CategoryRecord> {
		const category = await this.prisma.category.create({ data: { userId, ...data } });

		return this.serializeCategory(category);
	}

	public async findAll(userId: string, type?: TransactionType): Promise<CategoryRecord[]> {
		const categories = await this.prisma.category.findMany({
			where: {
				userId,
				...(type !== undefined ? { type } : {}),
			},
			orderBy: { createdAt: 'asc' },
		});

		return categories.map((category) => this.serializeCategory(category));
	}

	public async findById(userId: string, categoryId: string): Promise<CategoryRecord | null> {
		const category = await this.prisma.category.findFirst({
			where: { id: categoryId, userId },
		});
		if (category === null) {
			return null;
		}

		return this.serializeCategory(category);
	}

	public async update(userId: string, categoryId: string, data: UpdateCategoryInput): Promise<CategoryRecord | null> {
		const existing = await this.prisma.category.findFirst({ where: { id: categoryId, userId } });
		if (existing === null) {
			return null;
		}

		const category = await this.prisma.category.update({
			where: { id: categoryId },
			data,
		});

		return this.serializeCategory(category);
	}

	public async delete(userId: string, categoryId: string): Promise<CategoryRecord | null> {
		const existing = await this.prisma.category.findFirst({ where: { id: categoryId, userId } });
		if (existing === null) {
			return null;
		}
		const category = await this.prisma.category.delete({ where: { id: categoryId } });

		return this.serializeCategory(category);
	}

	public async countTransactions(categoryId: string): Promise<number> {
		return this.prisma.transaction.count({ where: { categoryId } });
	}

	private serializeCategory(category: Category): CategoryRecord {
		return {
			...category,
			createdAt: category.createdAt.toISOString(),
		};
	}
}
