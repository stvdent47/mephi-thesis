import { Type, type Static } from '@sinclair/typebox';
import { TransactionTypeSchema } from '../../../../shared/types.js';

export const TransactionFilterQueryDto = Type.Object({
	page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
	limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
	from: Type.Optional(Type.String({ format: 'date' })),
	to: Type.Optional(Type.String({ format: 'date' })),
	accountId: Type.Optional(Type.String({ format: 'uuid' })),
	categoryId: Type.Optional(Type.String({ format: 'uuid' })),
	type: Type.Optional(TransactionTypeSchema),
});

export type TransactionFilterQueryDtoType = Static<typeof TransactionFilterQueryDto>;
