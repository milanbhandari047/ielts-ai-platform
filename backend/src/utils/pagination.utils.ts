export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
}

export function getPagination(query: { page?: string; limit?: string }) {
  const page = Math.max(1, parseInt(query.page ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? "10", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
