import type { PaginatedResult } from '../../../shared/types.js';
import type {
	CreateAccountCommand,
	CreateAccountResult,
	DeleteAccountResult,
	FindAccountByIdResult,
	FindAllAccountsResult,
	UpdateAccountCommand,
	UpdateAccountResult,
} from '../domain/account.types.js';

export interface IAccountService {
	create(userId: string, input: CreateAccountCommand): Promise<CreateAccountResult>;
	findAll(userId: string, page: number, limit: number): Promise<PaginatedResult<FindAllAccountsResult>>;
	findById(userId: string, accountId: string): Promise<FindAccountByIdResult>;
	update(userId: string, accountId: string, input: UpdateAccountCommand): Promise<UpdateAccountResult>;
	delete(userId: string, accountId: string): Promise<DeleteAccountResult>;
}
