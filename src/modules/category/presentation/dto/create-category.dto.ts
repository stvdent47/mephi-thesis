import { Type, type Static } from '@sinclair/typebox';
import { TransactionTypeSchema } from '../../../../shared/types.js';

export const CreateCategoryRequestDto = Type.Object({
	name: Type.String(),
	type: TransactionTypeSchema,
	icon: Type.Optional(Type.String()),
	color: Type.Optional(Type.String()),
});

export type CreateCategoryRequestDtoType = Static<typeof CreateCategoryRequestDto>;
