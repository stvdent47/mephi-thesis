export interface UserRecord {
	id: string;
	email: string;
	name: string | null;
}

export interface UserRecordWithPassword extends UserRecord {
	passwordHash: string;
}

export interface NewUserInput {
	email: string;
	password: string;
	name?: string;
}

export interface CreateUserInput {
	email: string;
	passwordHash: string;
	name: string | null;
}

export interface RegisterCommand {
	email: string;
	password: string;
	name?: string;
}

export interface RegisterResult {
	id: string;
	email: string;
	name: string | null;
}

export interface LoginCommand {
	email: string;
	password: string;
}

export interface LoginResult {
	token: string;
	user: UserRecord;
}

export interface UserInfoResult {
	id: string;
	email: string;
	name: string | null;
}
