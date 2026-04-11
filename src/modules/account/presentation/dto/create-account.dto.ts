import { Type, type Static } from '@sinclair/typebox';
import { AccountTypeSchema } from '../../../../shared/types.js';

export const CreateAccountRequestDto = Type.Object({
	name: Type.String(),
	type: AccountTypeSchema,
	currency: Type.Optional(Type.String({ default: 'RUB' })),
});

export type CreateAccountRequestDtoType = Static<typeof CreateAccountRequestDto>;
