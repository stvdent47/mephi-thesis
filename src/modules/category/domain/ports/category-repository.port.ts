import type { TransactionType } from '../../../../generated/prisma/enums.js';
import type {
	CategoryRecord,
	CreateCategoryInput,
	UpdateCategoryInput,
} from '../category.types.js';

export interface ICategoryRepository {
	create(userId: string, data: CreateCategoryInput): Promise<CategoryRecord>;
	findAll(userId: string, type?: TransactionType): Promise<CategoryRecord[]>;
	findById(userId: string, categoryId: string): Promise<CategoryRecord | null>;
	update(userId: string, categoryId: string, data: UpdateCategoryInput): Promise<CategoryRecord | null>;
	delete(userId: string, categoryId: string): Promise<CategoryRecord | null>;
	countTransactions(categoryId: string): Promise<number>;
}
