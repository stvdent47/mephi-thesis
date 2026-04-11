import type { PaginatedResult } from "../../../../shared/types.js";
import type {
	AccountRecord,
	CreateAccountInput,
	UpdateAccountInput,
} from "../account.types.js";

export interface IAccountRepository {
	create(userId: string, data: CreateAccountInput): Promise<AccountRecord>;
	findAll(userId: string, page: number, limit: number): Promise<PaginatedResult<AccountRecord>>;
	findById(userId: string, accountId: string): Promise<AccountRecord | null>;
	update(userId: string, accountId: string, data: UpdateAccountInput): Promise<AccountRecord | null>;
	delete(userId: string, accountId: string): Promise<AccountRecord | null>;
}
