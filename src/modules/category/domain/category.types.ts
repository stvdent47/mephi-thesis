import type { TransactionType } from '../../../generated/prisma/enums.js';

export interface CategoryRecord {
	id: string;
	userId: string;
	name: string;
	type: TransactionType;
	icon: string | null;
	color: string | null;
	createdAt: string;
}

export interface CreateCategoryCommand {
	name: string;
	type: TransactionType;
	icon?: string;
	color?: string;
}

export interface CreateCategoryResult extends CategoryRecord { }

export interface FindAllCategoriesResult {
	data: CategoryRecord[];
}

export interface FindCategoryByIdResult extends CategoryRecord { }

export interface UpdateCategoryCommand {
	name?: string;
	icon?: string;
	color?: string;
}

export interface UpdateCategoryResult extends CategoryRecord { }

export interface DeleteCategoryResult extends CategoryRecord { }

export interface CreateCategoryInput {
	name: string;
	type: TransactionType;
	icon: string | null;
	color: string | null;
}

export interface UpdateCategoryInput {
	name?: string;
	icon?: string;
	color?: string;
}
