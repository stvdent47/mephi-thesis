import type { CreateUserInput, UserRecord, UserRecordWithPassword } from "../auth.types.js";

export interface IUserRepository {
	create(data: CreateUserInput): Promise<UserRecord>;
	findByEmail(email: string): Promise<UserRecordWithPassword | null>;
	findById(id: string): Promise<UserRecord | null>;
}
