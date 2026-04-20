import type { FindTransactionsInput, TransactionWithCategory } from '../aggregation.types.js';

export interface IAggregationRepository {
	findTransactions(data: FindTransactionsInput): Promise<TransactionWithCategory[]>;
}
