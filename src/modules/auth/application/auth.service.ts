import type { LoginCommand, LoginResult, RegisterCommand, RegisterResult, UserInfoResult } from "../domain/auth.types.js";
import { User } from "../domain/entities/user.entity.js";
import { InvalidCredentialsError, UserNotFoundError } from "../domain/errors/errors.js";
import type { IPasswordHasher } from "../domain/ports/password-hasher.port.js";
import type { ITokenService } from "../domain/ports/token-service.port.js";
import type { IUserRepository } from "../domain/ports/user-repository.port.js";
import type { IAuthService } from "./auth-service.port.js";

export class AuthService implements IAuthService {
	constructor(
		private readonly passwordHasher: IPasswordHasher,
		private readonly tokenService: ITokenService,
		private readonly userRepository: IUserRepository,
	) { }

	public async register(command: RegisterCommand): Promise<RegisterResult> {
		const input = await User.prepareForCreation(command, this.passwordHasher);
		const { id, email, name } = await this.userRepository.create(input);

		return { id, email, name };
	}

	public async login(command: LoginCommand): Promise<LoginResult> {
		const userData = await this.userRepository.findByEmail(command.email);
		if (userData === null) {
			throw new InvalidCredentialsError();
		}

		const user = User.fromPersistence(userData);
		const passwordMatch = await user.verifyPassword(command.password, this.passwordHasher);
		if (!passwordMatch) {
			throw new InvalidCredentialsError();
		}

		const token = this.tokenService.sign({ id: user.id, email: user.email });

		return { token, user: user.toRecord() };
	}

	public async getUserInfo(userId: string): Promise<UserInfoResult> {
		const user = await this.userRepository.findById(userId);
		if (user === null) {
			throw new UserNotFoundError(userId);
		}

		return user;
	}
}
