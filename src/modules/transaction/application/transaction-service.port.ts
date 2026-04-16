import type {
	CreateTransactionCommand,
	CreateTransactionResult,
	FindAllTransactionsResult,
	FindTransactionByIdResult,
	UpdateTransactionCommand,
	UpdateTransactionResult,
	DeleteTransactionResult,
	TransactionFilterInput,
} from '../domain/transaction.types.js';

export interface ITransactionService {
	create(userId: string, command: CreateTransactionCommand): Promise<CreateTransactionResult>;
	findAll(userId: string, filters: TransactionFilterInput): Promise<FindAllTransactionsResult>;
	findById(userId: string, transactionId: string): Promise<FindTransactionByIdResult>;
	update(userId: string, transactionId: string, command: UpdateTransactionCommand): Promise<UpdateTransactionResult>;
	delete(userId: string, transactionId: string): Promise<DeleteTransactionResult>;
}
