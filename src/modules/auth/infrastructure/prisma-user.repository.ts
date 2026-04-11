import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { CreateUserInput, UserRecord, UserRecordWithPassword } from '../domain/auth.types.js';
import { DuplicateEmailError } from '../domain/errors/errors.js';
import type { IUserRepository } from '../domain/ports/user-repository.port.js';

export class PrismaUserRepository implements IUserRepository {
	constructor(
		private readonly prisma: PrismaClient,
	) { }

	public async create(data: CreateUserInput): Promise<UserRecord> {
		try {
			const { email, passwordHash, name } = data;
			const user = await this.prisma.user.create({
				data: {
					email,
					passwordHash,
					name,
				},
				select: { id: true, email: true, name: true },
			});

			return user;
		} catch (err: unknown) {
			if (
				typeof err === 'object' &&
				err !== null &&
				'code' in err &&
				(err as { code: string }).code === 'P2002'
			) {
				throw new DuplicateEmailError(data.email);
			}

			throw err;
		}
	}

	public async findByEmail(email: string): Promise<UserRecordWithPassword | null> {
		const user = await this.prisma.user.findUnique({ where: { email } });

		if (user === null) {
			return null;
		}

		const { id, email: userEmail, name, passwordHash } = user;

		return {
			id,
			email: userEmail,
			name,
			passwordHash,
		};
	}

	public async findById(id: string): Promise<UserRecord | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: { id: true, email: true, name: true },
		});

		return user;
	}
}
