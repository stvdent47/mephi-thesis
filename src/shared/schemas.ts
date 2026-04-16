import { Type, type Static } from '@sinclair/typebox';

export const UUIDParam = Type.Object({ id: Type.String({ format: 'uuid' }) });
export type UUIDParam = Static<typeof UUIDParam>;

export const PaginationQuery = Type.Object({
	page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
	limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
});
export type PaginationQueryType = Static<typeof PaginationQuery>;
