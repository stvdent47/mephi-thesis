import { Type, type Static } from '@sinclair/typebox';
import { AccountTypeSchema } from '../../../../shared/types.js';

export const AccountResponseDto = Type.Object({
	id: Type.String({ format: 'uuid' }),
	userId: Type.String({ format: 'uuid' }),
	name: Type.String(),
	type: AccountTypeSchema,
	currency: Type.String(),
	balance: Type.Number(),
	isActive: Type.Boolean(),
	createdAt: Type.Number(),
	updatedAt: Type.String({ format: 'date-time' }),
});

export const AccountListResponseDto = Type.Object({
	data: Type.Array(AccountResponseDto),
	pagination: Type.Object({
		page: Type.Integer(),
		limit: Type.Integer(),
		total: Type.Integer(),
		totalPages: Type.Integer(),
	}),
});

export type AccountResponseDtoType = Static<typeof AccountResponseDto>;
export type AccountListResponseDtoType = Static<typeof AccountListResponseDto>;
