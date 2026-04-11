import bcrypt from 'bcrypt';

import type { IPasswordHasher } from '../domain/ports/password-hasher.port.js';

const SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements IPasswordHasher {
	public async hash(password: string): Promise<string> {
		return bcrypt.hash(password, SALT_ROUNDS);
	}

	public async compare(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}
}
