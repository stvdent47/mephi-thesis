import type { PrismaClient, Account } from '../../../generated/prisma/client.js';
import { paginate, paginatedResponse } from '../../../utils/pagination.js';
import type { IAccountRepository } from '../domain/ports/account-repository.port.js';
import type {
	AccountRecord,
	CreateAccountInput,
	UpdateAccountInput,
} from '../domain/account.types.js';
import type { PaginatedResult } from '../../../shared/types.js';

export class PrismaAccountRepository implements IAccountRepository {
	constructor(
		private readonly prisma: PrismaClient,
	) { }

	public async create(userId: string, data: CreateAccountInput): Promise<AccountRecord> {
		const { name, type, currency = 'RUB' } = data;
		const account = await this.prisma.account.create({
			data: {
				userId,
				name,
				type,
				currency,
				balance: 0,
			},
		});

		return this.serializeAccount(account);
	}

	public async findAll(userId: string, page: number, limit: number): Promise<PaginatedResult<AccountRecord>> {
		const { skip, take } = paginate(page, limit);

		const [accounts, total] = await Promise.all([
			this.prisma.account.findMany({
				where: { userId },
				skip,
				take,
				orderBy: { createdAt: 'asc' },
			}),
			this.prisma.account.count({ where: { userId } }),
		]);

		return paginatedResponse(
			accounts.map((account) => this.serializeAccount(account)),
			total,
			page,
			limit,
		);
	}

	public async findById(userId: string, accountId: string): Promise<AccountRecord | null> {
		const account = await this.prisma.account.findFirst({
			where: { id: accountId, userId },
		});
		if (account === null) {
			return null;
		}

		return this.serializeAccount(account);
	}

	public async update(userId: string, accountId: string, data: UpdateAccountInput): Promise<AccountRecord | null> {
		const existing = await this.prisma.account.findFirst({
			where: { id: accountId, userId },
		});
		if (existing === null) {
			return null;
		}

		const account = await this.prisma.account.update({
			where: { id: accountId },
			data,
		});

		return this.serializeAccount(account);
	}

	public async delete(userId: string, accountId: string): Promise<AccountRecord | null> {
		const existing = await this.prisma.account.findFirst({
			where: { id: accountId, userId },
		});
		if (existing === null) {
			return null;
		}

		const account = await this.prisma.account.update({
			where: { id: accountId },
			data: { isActive: false },
		});

		return this.serializeAccount(account);
	}

	private serializeAccount(account: Account): AccountRecord {
		return {
			...account,
			balance: account.balance.toNumber(),
			createdAt: account.createdAt.toISOString(),
			updatedAt: account.updatedAt.toISOString(),
		};
	}
}
