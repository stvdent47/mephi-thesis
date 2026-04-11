import type { JWT } from '@fastify/jwt';

import type { ITokenService } from '../domain/ports/token-service.port.js';
import type { UserIdentity } from '../../../shared/types.js';

type JwtPayload = UserIdentity;

export class FastifyJwtTokenService implements ITokenService {
	constructor(
		private readonly jwt: JWT,
	) { }

	public sign(identity: UserIdentity): string {
		return this.jwt.sign(identity);
	}

	public verify(token: string): UserIdentity {
		const decoded = this.jwt.verify<JwtPayload>(token);
		return { id: decoded.id, email: decoded.email };
	}
}
