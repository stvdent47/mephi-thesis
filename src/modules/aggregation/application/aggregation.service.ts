import type { IAggregationRepository } from '../domain/ports/aggregation-repository.port.js';
import type { IAggregationService } from './aggregation-service.port.js';
import { GroupBy, type AggregatedDataResult, type CategorySummaryResult, type CategoryBreakdown, type AggregatedDataQuery, type PeriodEntry, type CategorySummaryEntry } from '../domain/aggregation.types.js';
import { TransactionType } from '../../../generated/prisma/client.js';

export class AggregationService implements IAggregationService {
	constructor(
		private readonly aggregationRepository: IAggregationRepository,
	) { }

	public async getAggregatedData(userId: string, query: AggregatedDataQuery): Promise<AggregatedDataResult[]> {
		const { from, to, groupBy, accountId } = query;
		const transactions = await this.aggregationRepository.findTransactions({
			userId,
			from,
			to,
			accountId,
		});

		const periodMap = new Map<string, PeriodEntry>();

		for (const transaction of transactions) {
			const period = this.getPeriodKey(transaction.date, groupBy);
			if (!periodMap.has(period)) {
				periodMap.set(period, { income: 0, expense: 0, categoryMap: new Map() });
			}

			const periodEntry = periodMap.get(period)!;
			const amount = transaction.amount.toNumber();

			if (transaction.type === TransactionType.INCOME) {
				periodEntry.income += amount;
			} else {
				periodEntry.expense += amount;
			}

			const categoryEntry = periodEntry.categoryMap.get(transaction.categoryId);
			if (categoryEntry !== undefined) {
				categoryEntry.total += amount;
			} else {
				periodEntry.categoryMap.set(
					transaction.categoryId,
					{
						name: transaction.category.name,
						total: amount,
					}
				);
			}
		}

		const result: AggregatedDataResult[] = [];
		const sortedPeriods = Array.from(periodMap.keys()).sort();

		for (const period of sortedPeriods) {
			const periodEntry = periodMap.get(period);
			if (periodEntry === undefined) {
				continue;
			}

			const categories: CategoryBreakdown[] = Array.from(periodEntry.categoryMap.entries()).map(
				([id, { name, total }]) => ({
					id,
					name,
					total,
				}),
			);

			result.push({
				period,
				totalIncome: periodEntry.income,
				totalExpense: periodEntry.expense,
				netAmount: periodEntry.income - periodEntry.expense,
				categories,
			});
		}

		return result;
	}

	public async getCategorySummary(userId: string, from: string, to: string): Promise<CategorySummaryResult[]> {
		const transactions = await this.aggregationRepository.findTransactions({ userId, from, to, accountId: null });

		const categoryMap = new Map<string, CategorySummaryEntry>();

		for (const transaction of transactions) {
			const amount = transaction.amount.toNumber();
			const existing = categoryMap.get(transaction.categoryId);
			if (existing !== undefined) {
				existing.total += amount;
			} else {
				categoryMap.set(transaction.categoryId, {
					name: transaction.category.name,
					type: transaction.category.type,
					total: amount,
				});
			}
		}

		return Array.from(categoryMap.entries())
			.map(([id, { name, type, total }]) => ({
				id,
				name,
				type,
				total,
			}))
			.sort((a, b) => b.total - a.total);
	}

	public async getMonthlyTrend(userId: string, months: number): Promise<AggregatedDataResult[]> {
		const now = new Date();
		const fromDate = new Date(now);

		fromDate.setUTCMonth(fromDate.getUTCMonth() - months);
		fromDate.setUTCDate(1);
		fromDate.setUTCHours(0, 0, 0, 0);

		const from = fromDate.toISOString().slice(0, 10);
		const to = now.toISOString().slice(0, 10);

		return this.getAggregatedData(userId, { from, to, groupBy: GroupBy.Month, accountId: null });
	}

	private getPeriodKey(date: Date, groupBy: GroupBy): string {
		if (groupBy === GroupBy.Day) {
			return date.toISOString().slice(0, 10);
		}

		if (groupBy === GroupBy.Month) {
			return date.toISOString().slice(0, 7);
		}

		const d = new Date(date);
		const day = d.getUTCDay();
		const diff = (day === 0 ? -6 : 1 - day);
		d.setUTCDate(d.getUTCDate() + diff);

		return d.toISOString().slice(0, 10);
	}
}
