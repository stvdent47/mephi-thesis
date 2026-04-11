import type { LoginCommand, LoginResult, RegisterCommand, RegisterResult, UserInfoResult } from "../domain/auth.types.js";

export interface IAuthService {
	register(command: RegisterCommand): Promise<RegisterResult>;
	login(command: LoginCommand): Promise<LoginResult>;
	getUserInfo(userId: string): Promise<UserInfoResult>;
}
