import type { TransactionType } from '../../../generated/prisma/enums.js';
import type { PaginatedResult } from '../../../shared/types.js';

export interface TransactionRecord {
	id: string;
	userId: string;
	accountId: string;
	categoryId: string;
	amount: number;
	type: TransactionType;
	description: string | null;
	date: number;
	createdAt: number;
	account: { name: string; currency: string };
	category: { name: string; type: TransactionType };
}

export interface CreateTransactionCommand {
	accountId: string;
	categoryId: string;
	amount: number;
	type: TransactionType;
	description?: string;
	date: string;
}

export interface CreateTransactionResult extends TransactionRecord { }

export type FindAllTransactionsResult = PaginatedResult<TransactionRecord>;

export interface FindTransactionByIdResult extends TransactionRecord { }

export interface UpdateTransactionCommand {
	accountId?: string;
	categoryId?: string;
	amount?: number;
	type?: TransactionType;
	description?: string;
	date?: string;
}

export interface UpdateTransactionResult extends TransactionRecord { }

export interface DeleteTransactionResult extends TransactionRecord { }

export interface CreateTransactionInput {
	accountId: string;
	categoryId: string;
	amount: number;
	type: TransactionType;
	description: string | null;
	date: string;
}

export interface UpdateTransactionInput {
	accountId?: string;
	categoryId?: string;
	amount?: number;
	type?: TransactionType;
	description?: string;
	date?: string;
}

export type TransactionFilterInput = {
	page: number;
	limit: number;
	from?: string;
	to?: string;
	accountId?: string;
	categoryId?: string;
	type?: TransactionType;
};
