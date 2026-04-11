import { Type, type Static } from "@sinclair/typebox";

export const LoginRequestDto = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String(),
});

export type LoginRequestDtoType = Static<typeof LoginRequestDto>;

export const LoginResponseDto = Type.Object({
	token: Type.String(),
	user: Type.Object({
		id: Type.String({ format: 'uuid' }),
		email: Type.String({ format: 'email' }),
		name: Type.Union([Type.String(), Type.Null()]),
	}),
});
