import { Type, type Static } from '@sinclair/typebox';
import { TransactionTypeSchema } from '../../../../shared/types.js';

export const TransactionResponseDto = Type.Object({
	id: Type.String({ format: 'uuid' }),
	userId: Type.String({ format: 'uuid' }),
	accountId: Type.String({ format: 'uuid' }),
	categoryId: Type.String({ format: 'uuid' }),
	amount: Type.Number(),
	type: TransactionTypeSchema,
	description: Type.Union([Type.String(), Type.Null()]),
	date: Type.String({ format: 'date-time' }),
	createdAt: Type.String({ format: 'date-time' }),
	account: Type.Object({
		name: Type.String(),
		currency: Type.String(),
	}),
	category: Type.Object({
		name: Type.String(),
		type: TransactionTypeSchema,
	}),
});

export type TransactionResponseDtoType = Static<typeof TransactionResponseDto>;

export const TransactionListResponseDto = Type.Object({
	data: Type.Array(TransactionResponseDto),
	pagination: Type.Object({
		page: Type.Integer(),
		limit: Type.Integer(),
		total: Type.Integer(),
		totalPages: Type.Integer(),
	}),
});

export type TransactionListResponseDtoType = Static<typeof TransactionListResponseDto>;
