import { Type, type Static } from '@sinclair/typebox';

import { GroupBy } from '../../domain/aggregation.types.js';

export const AggregationQueryDto = Type.Object({
	from: Type.String({ format: 'date' }),
	to: Type.String({ format: 'date' }),
	groupBy: Type.Enum(GroupBy),
	accountId: Type.Optional(Type.String({ format: 'uuid' })),
});
export type AggregationQueryDtoType = Static<typeof AggregationQueryDto>;

const CategoryBreakdownItem = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	total: Type.Number(),
});

const AggregationPeriodItem = Type.Object({
	period: Type.String(),
	totalIncome: Type.Number(),
	totalExpense: Type.Number(),
	netAmount: Type.Number(),
	categories: Type.Array(CategoryBreakdownItem),
});

export const AggregationResponseDto = Type.Array(AggregationPeriodItem);
export type AggregationResponseDtoType = Static<typeof AggregationResponseDto>;
