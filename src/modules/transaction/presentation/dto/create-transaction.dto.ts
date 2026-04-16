import { Type, type Static } from '@sinclair/typebox';
import { TransactionTypeSchema } from '../../../../shared/types.js';

export const CreateTransactionRequestDto = Type.Object({
	accountId: Type.String({ format: 'uuid' }),
	categoryId: Type.String({ format: 'uuid' }),
	amount: Type.Number({ minimum: 0.01 }),
	type: TransactionTypeSchema,
	description: Type.Optional(Type.String()),
	date: Type.String({ format: 'date-time' }),
});

export type CreateTransactionRequestDtoType = Static<typeof CreateTransactionRequestDto>;
