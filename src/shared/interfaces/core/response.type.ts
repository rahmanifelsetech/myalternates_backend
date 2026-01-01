export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  metaData?: Record<string, unknown>;
}

export interface SingleResponse<T> extends ApiResponse<T> {}

export interface ListResponse<T> extends ApiResponse<T[]> {}

export interface PaginatedResponse<T> extends ListResponse<T> {
  metaData: PaginationMeta & Record<string, unknown>;
}

export interface EmptyResponse extends ApiResponse<null> {}

// Alias for backward compatibility if needed, or deprecate
export type SuccessResponse<T> = ApiResponse<T>;

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}
