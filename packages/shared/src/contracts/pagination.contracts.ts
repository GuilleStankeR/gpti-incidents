export interface PaginationQuery {
  readonly page?: number;
  readonly pageSize?: number;
}

export interface PaginatedResponse<TItem> {
  readonly items: readonly TItem[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
