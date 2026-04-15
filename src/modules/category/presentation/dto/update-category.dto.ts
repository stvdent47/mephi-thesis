import { Type, type Static } from '@sinclair/typebox';

export const UpdateCategoryRequestDto = Type.Object({
	name: Type.Optional(Type.String()),
	icon: Type.Optional(Type.String()),
	color: Type.Optional(Type.String()),
});
export type UpdateCategoryRequestDtoType = Static<typeof UpdateCategoryRequestDto>;
