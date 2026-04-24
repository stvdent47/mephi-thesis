import type { PaginatedResult } from '../../../../shared/types.js';
import type {
	TransactionRecord,
	CreateTransactionInput,
	UpdateTransactionInput,
	TransactionFilterQuery,
} from '../transaction.types.js';

export interface ITransactionRepository {
	create(userId: string, data: CreateTransactionInput): Promise<TransactionRecord>;
	findAll(userId: string, filters: TransactionFilterQuery): Promise<PaginatedResult<TransactionRecord>>;
	findById(userId: string, transactionId: string): Promise<TransactionRecord | null>;
	update(userId: string, transactionId: string, data: UpdateTransactionInput): Promise<TransactionRecord | null>;
	delete(userId: string, transactionId: string): Promise<TransactionRecord | null>;
}
