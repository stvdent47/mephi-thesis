import type { CreateUserInput, UserRecord, UserRecordWithPassword } from "../auth.types.js";
import { WeakPasswordError } from "../errors/errors.js";
import type { IPasswordHasher } from "../ports/password-hasher.port.js";

interface NewUserInput {
	email: string;
	password: string;
	name?: string;
}

export const PASSWORD_MIN_LENGTH = 6;

export class User {
	public static async prepareForCreation(
		input: NewUserInput,
		passwordHasher: IPasswordHasher,
	): Promise<CreateUserInput> {
		if (input.password.length < PASSWORD_MIN_LENGTH) {
			throw new WeakPasswordError(PASSWORD_MIN_LENGTH);
		}

		const passwordHash = await passwordHasher.hash(input.password);

		return {
			email: input.email,
			passwordHash,
			name: input.name ?? null,
		};
	}

	private constructor(
		public readonly id: string,
		public readonly email: string,
		public readonly name: string | null,
		private readonly passwordHash: string,
	) { }

	public static fromPersistence(data: UserRecordWithPassword): User {
		return new User(data.id, data.email, data.name, data.passwordHash);
	}

	public async verifyPassword(plaintext: string, passwordHasher: IPasswordHasher): Promise<boolean> {
		return passwordHasher.compare(plaintext, this.passwordHash);
	}

	public toRecord(): UserRecord {
		return { id: this.id, email: this.email, name: this.name };
	}
}
