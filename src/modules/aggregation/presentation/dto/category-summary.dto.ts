import { Type, type Static } from '@sinclair/typebox';

import { TransactionTypeSchema } from '../../../../shared/types.js';

export const CategorySummaryQueryDto = Type.Object({
	from: Type.String({ format: 'date' }),
	to: Type.String({ format: 'date' }),
});
export type CategorySummaryQueryDtoType = Static<typeof CategorySummaryQueryDto>;

const CategorySummaryItem = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	type: TransactionTypeSchema,
	total: Type.Number(),
});

export const CategorySummaryResponseDto = Type.Array(CategorySummaryItem);
export type CategorySummaryResponseDtoType = Static<typeof CategorySummaryResponseDto>;
