import { Type, type Static } from '@sinclair/typebox';
import { TransactionTypeSchema } from '../../../../shared/types.js';

export const CategoryTypeQueryDto = Type.Object({
	type: Type.Optional(TransactionTypeSchema),
});
export type CategoryTypeQueryDtoType = Static<typeof CategoryTypeQueryDto>;
