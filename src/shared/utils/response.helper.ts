import { HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  EmptyResponse,
  ListResponse,
  PaginatedResponse,
  PaginationMeta,
  SingleResponse,
  SuccessResponse,
} from '../interfaces/core/response.type';

export const createSuccessResponse = <T>(
  data: T,
  message = 'Success',
  metaData?: Record<string, unknown>,
): SuccessResponse<T> => {
  return {
    message,
    data,
    ...(metaData && { metaData }),
  };
};

export const createSingleResponse = <T>(
  data: T,
  message = 'Success',
  metaData?: Record<string, unknown>,
): SingleResponse<T> => {
  return {
    message,
    data,
    ...(metaData && { metaData }),
  };
};

export const createListResponse = <T>(
  data: T[],
  message = 'Success',
  metaData?: Record<string, unknown>,
): ListResponse<T> => {
  return {
    message,
    data,
    ...(metaData && { metaData }),
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  metaData: PaginationMeta & Record<string, unknown>,
  message = 'Success',
): PaginatedResponse<T> => {
  return {
    message,
    data,
    metaData,
  };
};

export const createEmptyResponse = (message = 'Success'): EmptyResponse => {
  return {
    message,
    data: null,
  };
};
