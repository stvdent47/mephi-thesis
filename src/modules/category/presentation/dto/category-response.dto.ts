import { Type, type Static } from '@sinclair/typebox';
import { TransactionTypeSchema } from '../../../../shared/types.js';

export const CategoryResponseDto = Type.Object({
	id: Type.String({ format: 'uuid' }),
	userId: Type.String({ format: 'uuid' }),
	name: Type.String(),
	type: TransactionTypeSchema,
	icon: Type.Union([Type.String(), Type.Null()]),
	color: Type.Union([Type.String(), Type.Null()]),
	createdAt: Type.String({ format: 'date-time' }),
});

export const CategoryListResponseDto = Type.Object({
	data: Type.Array(CategoryResponseDto),
});

export type CategoryResponseDtoType = Static<typeof CategoryResponseDto>;
export type CategoryListResponseDtoType = Static<typeof CategoryListResponseDto>;
