import type { UserIdentity } from '../../../shared/types.ts';

type JwtPayload = UserIdentity;
type JwtUser = UserIdentity;

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: JwtPayload;
		user: JwtUser;
	}
}
