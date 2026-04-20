import { type PrismaClient, type Prisma, TransactionType } from '../../../generated/prisma/client.js';
import { paginate, paginatedResponse } from '../../../utils/pagination.js';
import type { PaginatedResult } from '../../../shared/types.js';
import { NotFoundError } from '../../../shared/errors/errors.js';
import type { ITransactionRepository } from '../domain/ports/transaction-repository.port.js';
import type {
	TransactionRecord,
	CreateTransactionInput,
	UpdateTransactionInput,
	TransactionFilterInput,
} from '../domain/transaction.types.js';

const transactionInclude = {
	account: { select: { name: true, currency: true } },
	category: { select: { name: true, type: true } },
} as const;

interface TransactionWithRelations extends
	Prisma.TransactionGetPayload<{ include: typeof transactionInclude; }> { }

export class PrismaTransactionRepository implements ITransactionRepository {
	constructor(
		private readonly prisma: PrismaClient,
	) { }

	public async create(userId: string, data: CreateTransactionInput): Promise<TransactionRecord> {
		const account = await this.prisma.account.findFirst({ where: { id: data.accountId, userId } });
		if (account === null) {
			throw new NotFoundError('Account was not found');
		}

		const category = await this.prisma.category.findFirst({ where: { id: data.categoryId, userId } });
		if (category === null) {
			throw new NotFoundError('Category was not found');
		}

		const [tx] = await this.prisma.$transaction([
			this.prisma.transaction.create({
				data: {
					userId,
					accountId: data.accountId,
					categoryId: data.categoryId,
					amount: data.amount,
					type: data.type,
					description: data.description,
					date: new Date(data.date),
				},
			}),
			this.prisma.account.update({
				where: { id: data.accountId },
				data: {
					balance: data.type === TransactionType.INCOME
						? { increment: data.amount }
						: { decrement: data.amount },
				},
			}),
		]);

		const full = await this.prisma.transaction.findUnique({
			where: { id: tx.id },
			include: transactionInclude,
		});

		if (full === null) {
			throw new NotFoundError('Transaction was not found after creation');
		}

		return this.serializeTransaction(full);
	}

	public async findAll(userId: string, filters: TransactionFilterInput): Promise<PaginatedResult<TransactionRecord>> {
		const { skip, take } = paginate(filters.page, filters.limit);

		const where: Record<string, unknown> = { userId };

		if (filters.accountId !== undefined) {
			where.accountId = filters.accountId;
		}
		if (filters.categoryId !== undefined) {
			where.categoryId = filters.categoryId;
		}
		if (filters.type !== undefined) {
			where.type = filters.type;
		}
		if (filters.from !== undefined || filters.to !== undefined) {
			const dateFilter: Record<string, Date> = {};

			if (filters.from !== undefined) {
				dateFilter.gte = new Date(filters.from);
			}
			if (filters.to !== undefined) {
				dateFilter.lte = new Date(filters.to + 'T23:59:59.999Z');
			}

			where.date = dateFilter;
		}

		const [transactions, total] = await Promise.all([
			this.prisma.transaction.findMany({
				where,
				skip,
				take,
				orderBy: { date: 'desc' },
				include: transactionInclude,
			}),
			this.prisma.transaction.count({ where }),
		]);

		return paginatedResponse(
			transactions.map((tx) => this.serializeTransaction(tx)),
			total,
			filters.page,
			filters.limit,
		);
	}

	public async findById(userId: string, transactionId: string): Promise<TransactionRecord | null> {
		const transaction = await this.prisma.transaction.findFirst({
			where: { id: transactionId, userId },
			include: transactionInclude,
		});
		if (transaction === null) {
			return null;
		}

		return this.serializeTransaction(transaction);
	}

	public async update(userId: string, transactionId: string, data: UpdateTransactionInput): Promise<TransactionRecord | null> {
		const existing = await this.prisma.transaction.findFirst({
			where: { id: transactionId, userId },
			include: transactionInclude,
		});
		if (existing === null) {
			return null;
		}

		const oldAmount = Number(existing.amount);
		const oldType = existing.type;
		const newAmount = data.amount ?? oldAmount;
		const newType = data.type ?? oldType;
		const amountOrTypeChanged = data.amount !== undefined || data.type !== undefined;

		if (amountOrTypeChanged) {
			await this.prisma.$transaction([
				this.prisma.account.update({
					where: { id: existing.accountId },
					data: {
						balance: oldType === TransactionType.INCOME
							? { decrement: oldAmount }
							: { increment: oldAmount },
					},
				}),
				this.prisma.account.update({
					where: { id: existing.accountId },
					data: {
						balance: newType === TransactionType.INCOME
							? { increment: newAmount }
							: { decrement: newAmount },
					},
				}),
			]);
		}

		const updateData: Record<string, unknown> = {};

		if (data.accountId !== undefined) {
			updateData.accountId = data.accountId;
		}
		if (data.categoryId !== undefined) {
			updateData.categoryId = data.categoryId;
		}
		if (data.amount !== undefined) {
			updateData.amount = data.amount;
		}
		if (data.type !== undefined) {
			updateData.type = data.type;
		}
		if (data.description !== undefined) {
			updateData.description = data.description;
		}
		if (data.date !== undefined) {
			updateData.date = new Date(data.date);
		}

		const updated = await this.prisma.transaction.update({
			where: { id: transactionId },
			data: updateData,
			include: transactionInclude,
		});

		return this.serializeTransaction(updated);
	}

	public async delete(userId: string, transactionId: string): Promise<TransactionRecord | null> {
		const existing = await this.prisma.transaction.findFirst({
			where: { id: transactionId, userId },
			include: transactionInclude,
		});
		if (existing === null) {
			return null;
		}

		const serialized = this.serializeTransaction(existing);
		const amount = Number(existing.amount);

		await this.prisma.$transaction([
			this.prisma.account.update({
				where: { id: existing.accountId },
				data: {
					balance: existing.type === TransactionType.INCOME
						? { decrement: amount }
						: { increment: amount },
				},
			}),
			this.prisma.transaction.delete({ where: { id: transactionId } }),
		]);

		return serialized;
	}

	private serializeTransaction(transaction: TransactionWithRelations): TransactionRecord {
		const {
			id,
			userId,
			accountId,
			categoryId,
			amount,
			type,
			description,
			date,
			createdAt,
			account,
			category,
		} = transaction;

		return {
			id,
			userId,
			accountId,
			categoryId,
			amount: amount.toNumber(),
			type,
			description,
			date: date.getTime(),
			createdAt: createdAt.getTime(),
			account,
			category,
		};
	}
}
