import { type PrismaClient, type Prisma } from '../../../generated/prisma/client.js';
import { transactionWithCategoryInclude, type FindTransactionsInput, type TransactionWithCategory } from '../domain/aggregation.types.js';
import type { IAggregationRepository } from '../domain/ports/aggregation-repository.port.js';

export class PrismaAggregationRepository implements IAggregationRepository {
	constructor(
		private readonly prisma: PrismaClient,
	) { }

	public async findTransactions(data: FindTransactionsInput): Promise<TransactionWithCategory[]> {
		const { userId, from, to, accountId } = data;
		const where: Prisma.TransactionWhereInput = {
			userId: userId,
			date: {
				gte: new Date(from),
				lte: new Date(to + 'T23:59:59.999Z'),
			},
		};

		if (accountId !== null) {
			where.accountId = accountId;
		}

		return this.prisma.transaction.findMany({
			where,
			include: transactionWithCategoryInclude,
			orderBy: { date: 'asc' },
		});
	}
}
