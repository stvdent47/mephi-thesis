import type { Prisma, TransactionType } from '../../../generated/prisma/client.js';

export enum GroupBy {
	Day = 'day',
	Week = 'week',
	Month = 'month',
}

export interface AggregatedDataQuery {
	from: string;
	to: string;
	groupBy: GroupBy;
	accountId: string | null;
}

export interface AggregatedDataResult {
	period: string;
	totalIncome: number;
	totalExpense: number;
	netAmount: number;
	categories: CategoryBreakdown[];
}

interface CategoryEntry {
	name: string;
	total: number;
}

export interface CategorySummaryEntry extends CategoryEntry {
	type: TransactionType;
}

export interface PeriodEntry {
	income: number;
	expense: number;
	categoryMap: Map<string, CategoryEntry>;
}

export interface CategoryBreakdown {
	id: string;
	name: string;
	total: number;
}

export interface CategorySummaryResult {
	id: string;
	name: string;
	total: number;
	type: TransactionType;
}

export interface FindTransactionsInput {
	userId: string;
	from: string;
	to: string;
	accountId: string | null;
}

export const transactionWithCategoryInclude = {
	category: { select: { name: true, type: true } },
} as const;

export interface TransactionWithCategory extends
	Prisma.TransactionGetPayload<{ include: typeof transactionWithCategoryInclude }> { }
