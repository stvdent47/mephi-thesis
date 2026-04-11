export class DuplicateEmailError extends Error {
	constructor(email: string) {
		super(`Email "${email}" is already registered`);
		this.name = 'DuplicateEmailError';
	}
}

export class InvalidCredentialsError extends Error {
	constructor() {
		super('Invalid credentials');
		this.name = 'InvalidCredentialsError';
	}
}

export class UserNotFoundError extends Error {
	constructor(userId: string) {
		super(`User "${userId}" not found`);
		this.name = 'UserNotFoundError';
	}
}

export class WeakPasswordError extends Error {
	constructor(minLength: number) {
		super(`Password must be at least ${minLength} characters`);
		this.name = 'WeakPasswordError';
	}
}
