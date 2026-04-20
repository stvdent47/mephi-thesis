import { Type, type Static } from '@sinclair/typebox';

import { AggregationResponseDto, type AggregationResponseDtoType } from './aggregation.dto.js';

export const MonthlyTrendQueryDto = Type.Object({
	months: Type.Optional(
		Type.Integer({
			minimum: 1,
			maximum: 36,
			default: 12,
		})
	),
});
export type MonthlyTrendQueryDtoType = Static<typeof MonthlyTrendQueryDto>;

export const MonthlyTrendResponseDto = AggregationResponseDto;
export type MonthlyTrendResponseDtoType = AggregationResponseDtoType;
