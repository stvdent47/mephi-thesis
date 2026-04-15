import type { TransactionType } from '../../../generated/prisma/enums.js';
import type {
	CreateCategoryCommand,
	CreateCategoryResult,
	DeleteCategoryResult,
	FindAllCategoriesResult,
	FindCategoryByIdResult,
	UpdateCategoryCommand,
	UpdateCategoryResult,
} from '../domain/category.types.js';

export interface ICategoryService {
	create(userId: string, command: CreateCategoryCommand): Promise<CreateCategoryResult>;
	findAll(userId: string, type?: TransactionType): Promise<FindAllCategoriesResult>;
	findById(userId: string, categoryId: string): Promise<FindCategoryByIdResult>;
	update(userId: string, categoryId: string, command: UpdateCategoryCommand): Promise<UpdateCategoryResult>;
	delete(userId: string, categoryId: string): Promise<DeleteCategoryResult>;
}
