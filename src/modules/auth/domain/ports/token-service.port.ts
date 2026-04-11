import type { UserIdentity } from '../../../../shared/types.js';

export interface ITokenService {
	sign(payload: UserIdentity): string;
	verify(token: string): UserIdentity;
}
