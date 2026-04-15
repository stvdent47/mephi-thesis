import { NotFoundError } from '../../../shared/errors/errors.js';
import type { PaginatedResult } from '../../../shared/types.js';
import type { IAccountRepository } from '../domain/ports/account-repository.port.js';
import type {
	CreateAccountCommand,
	CreateAccountResult,
	DeleteAccountResult,
	FindAccountByIdResult,
	FindAllAccountsResult,
	UpdateAccountCommand,
	UpdateAccountResult,
} from '../domain/account.types.js';
import type { IAccountService } from './account-service.port.js';

export class AccountService implements IAccountService {
	constructor(
		private readonly accountRepository: IAccountRepository,
	) { }

	public async create(userId: string, command: CreateAccountCommand): Promise<CreateAccountResult> {
		return this.accountRepository.create(userId, command);
	}

	public async findAll(userId: string, page: number, limit: number): Promise<PaginatedResult<FindAllAccountsResult>> {
		return this.accountRepository.findAll(userId, page, limit);
	}

	public async findById(userId: string, accountId: string): Promise<FindAccountByIdResult> {
		const account = await this.accountRepository.findById(userId, accountId);
		if (account === null) {
			throw new NotFoundError('Account was not found');
		}

		return account;
	}

	public async update(userId: string, accountId: string, command: UpdateAccountCommand): Promise<UpdateAccountResult> {
		const account = await this.accountRepository.update(userId, accountId, command);
		if (account === null) {
			throw new NotFoundError('Account was not found');
		}

		return account;
	}

	public async delete(userId: string, accountId: string): Promise<DeleteAccountResult> {
		const account = await this.accountRepository.delete(userId, accountId);
		if (account === null) {
			throw new NotFoundError('Account was not found');
		}

		return account;
	}
}
