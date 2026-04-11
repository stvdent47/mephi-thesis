import type { FastifyRequest } from "fastify";
import type { ITokenService } from "../domain/ports/token-service.port.js";
import { UnauthorizedError } from "../../../shared/errors/errors.js";

export const createAuthGuard = (tokenService: ITokenService) =>
	async (request: FastifyRequest): Promise<void> => {
		const authHeader = request.headers.authorization;
		if (authHeader === undefined) {
			throw new UnauthorizedError();
		}

		const [scheme, token] = authHeader.split(' ');
		if (scheme !== 'Bearer' || token === undefined) {
			throw new UnauthorizedError();
		}

		try {
			request.user = tokenService.verify(token);
		} catch {
			throw new UnauthorizedError();
		}
	};
