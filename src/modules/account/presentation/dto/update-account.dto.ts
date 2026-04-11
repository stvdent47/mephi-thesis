import { Type, type Static } from '@sinclair/typebox';
import { AccountTypeSchema } from '../../../../shared/types.js';

export const UpdateAccountRequestDto = Type.Object({
	name: Type.Optional(Type.String()),
	type: Type.Optional(AccountTypeSchema),
	isActive: Type.Optional(Type.Boolean()),
});

export type UpdateAccountRequestDtoType = Static<typeof UpdateAccountRequestDto>;
