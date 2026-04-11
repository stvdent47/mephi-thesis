import type { PaginatedResult } from "../shared/types.js";

interface PaginationParams {
	skip: number;
	take: number;
}

export function paginate(page: number = 1, limit: number = 20): PaginationParams {
	return {
		skip: (page - 1) * limit,
		take: limit,
	};
}

export function paginatedResponse<T>(data: T[], total: number, page: number = 1, limit: number = 20): PaginatedResult<T> {
	return {
		data,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}
