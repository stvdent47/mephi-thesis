import { Type, type Static } from "@sinclair/typebox";

import { PASSWORD_MIN_LENGTH } from "../../domain/entities/user.entity.js";

export const RegisterRequestDto = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String({ minLength: PASSWORD_MIN_LENGTH }),
	name: Type.Optional(Type.String()),
});

export type RegisterRequestDtoType = Static<typeof RegisterRequestDto>;

export const RegisterResponseDto = Type.Object({
	id: Type.String({ format: 'uuid' }),
	email: Type.String({ format: 'email' }),
	name: Type.Union([Type.String(), Type.Null()]),
});