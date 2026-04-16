import { Type, type Static } from '@sinclair/typebox';
import { TransactionTypeSchema } from '../../../../shared/types.js';

export const UpdateTransactionRequestDto = Type.Object({
	accountId: Type.Optional(Type.String({ format: 'uuid' })),
	categoryId: Type.Optional(Type.String({ format: 'uuid' })),
	amount: Type.Optional(Type.Number({ minimum: 0.01 })),
	type: Type.Optional(TransactionTypeSchema),
	description: Type.Optional(Type.String()),
	date: Type.Optional(Type.String({ format: 'date-time' })),
});

export type UpdateTransactionRequestDtoType = Static<typeof UpdateTransactionRequestDto>;
