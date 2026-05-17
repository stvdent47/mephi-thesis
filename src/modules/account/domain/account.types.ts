import type { AccountType } from "../../../generated/prisma/enums.js";

export interface AccountRecord {
	id: string;
	userId: string;
	name: string;
	type: AccountType;
	currency: string;
	balance: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAccountCommand {
	name: string;
	type: AccountType;
	currency?: string;
}

export interface CreateAccountResult extends AccountRecord { }

export interface FindAllAccountsResult extends AccountRecord { }

export interface FindAccountByIdResult extends AccountRecord { }

export interface UpdateAccountCommand {
	name?: string;
	type?: AccountType;
	isActive?: boolean;
}

export interface UpdateAccountResult extends AccountRecord { }

export interface DeleteAccountResult extends AccountRecord { }

export interface CreateAccountInput {
	name: string;
	type: AccountType;
	currency?: string;
}

export interface UpdateAccountInput {
	name?: string;
	type?: AccountType;
	isActive?: boolean;
}
