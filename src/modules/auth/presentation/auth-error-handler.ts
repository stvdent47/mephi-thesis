import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../../../shared/errors/errors.js";
import { DuplicateEmailError, InvalidCredentialsError, UserNotFoundError, WeakPasswordError } from "../domain/errors/errors.js";

export function handleAuthError(error: unknown): never {
	if (error instanceof InvalidCredentialsError) {
		throw new UnauthorizedError('Invalid credentials');
	}
	if (error instanceof DuplicateEmailError) {
		throw new ConflictError('Email already registered');
	}
	if (error instanceof UserNotFoundError) {
		throw new NotFoundError(error.message);
	}
	if (error instanceof WeakPasswordError) {
		throw new BadRequestError(error.message);
	}

	throw error as Error;
}
