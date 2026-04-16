import { NotFoundError } from '../../../shared/errors/errors.js';
import type { ITransactionRepository } from '../domain/ports/transaction-repository.port.js';
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
import type { ITransactionService } from './transaction-service.port.js';

export class TransactionService implements ITransactionService {
	constructor(
		private readonly transactionRepository: ITransactionRepository,
	) { }

	public async create(userId: string, command: CreateTransactionCommand): Promise<CreateTransactionResult> {
		const data = { ...command, description: command.description ?? null };

		return this.transactionRepository.create(userId, data);
	}

	public async findAll(userId: string, filters: TransactionFilterInput): Promise<FindAllTransactionsResult> {
		return this.transactionRepository.findAll(userId, filters);
	}

	public async findById(userId: string, transactionId: string): Promise<FindTransactionByIdResult> {
		const transaction = await this.transactionRepository.findById(userId, transactionId);
		if (transaction === null) {
			throw new NotFoundError('Transaction was not found');
		}

		return transaction;
	}

	public async update(userId: string, transactionId: string, command: UpdateTransactionCommand): Promise<UpdateTransactionResult> {
		const transaction = await this.transactionRepository.update(userId, transactionId, command);
		if (transaction === null) {
			throw new NotFoundError('Transaction was not found');
		}

		return transaction;
	}

	public async delete(userId: string, transactionId: string): Promise<DeleteTransactionResult> {
		const transaction = await this.transactionRepository.delete(userId, transactionId);
		if (transaction === null) {
			throw new NotFoundError('Transaction was not found');
		}

		return transaction;
	}
}
