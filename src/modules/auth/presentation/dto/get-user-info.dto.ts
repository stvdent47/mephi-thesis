import { Type } from "@sinclair/typebox";

export const GetUserInfoResponseDto = Type.Object({
	id: Type.String({ format: 'uuid' }),
	email: Type.String({ format: 'email' }),
	name: Type.Union([Type.String(), Type.Null()]),
});
