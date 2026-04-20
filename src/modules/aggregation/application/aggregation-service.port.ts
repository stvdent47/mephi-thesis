import type { AggregatedDataQuery, AggregatedDataResult, CategorySummaryResult } from '../domain/aggregation.types.js';

export interface IAggregationService {
	getAggregatedData(userId: string, query: AggregatedDataQuery): Promise<AggregatedDataResult[]>;
	getCategorySummary(userId: string, from: string, to: string): Promise<CategorySummaryResult[]>;
	getMonthlyTrend(userId: string, months: number): Promise<AggregatedDataResult[]>;
}
