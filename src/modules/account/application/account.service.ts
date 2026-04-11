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
import { NotFoundError } from '../../../shared/errors/errors.js';
import type { IAccountService } from './account-service.port.js';
import type { PaginatedResult } from '../../../shared/types.js';

export class AccountService implements IAccountService {
	constructor(
		private readonly accountRepository: IAccountRepository,
	) { }

	public async create(userId: string, input: CreateAccountCommand): Promise<CreateAccountResult> {
		return this.accountRepository.create(userId, input);
	}

	public async findAll(userId: string, page: number, limit: number): Promise<PaginatedResult<FindAllAccountsResult>> {
		return this.accountRepository.findAll(userId, page, limit);
	}

	public async findById(userId: string, accountId: string): Promise<FindAccountByIdResult> {
		const result = await this.accountRepository.findById(userId, accountId);
		if (result === null) {
			throw new NotFoundError('Account not found');
		}

		return result;
	}

	public async update(userId: string, accountId: string, input: UpdateAccountCommand): Promise<UpdateAccountResult> {
		const result = await this.accountRepository.update(userId, accountId, input);
		if (result === null) {
			throw new NotFoundError('Account not found');
		}

		return result;
	}

	public async delete(userId: string, accountId: string): Promise<DeleteAccountResult> {
		const result = await this.accountRepository.delete(userId, accountId);
		if (result === null) {
			throw new NotFoundError('Account not found');
		}

		return result;
	}
}
