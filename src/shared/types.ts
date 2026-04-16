import { Type } from "@sinclair/typebox";
import { AccountType, TransactionType } from "../generated/prisma/client.js";

export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface UserIdentity {
	id: string;
	email: string;
}

export const AccountTypeSchema = Type.Enum(AccountType);
export const TransactionTypeSchema = Type.Enum(TransactionType);
