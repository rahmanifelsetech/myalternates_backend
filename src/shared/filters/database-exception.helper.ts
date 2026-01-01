import { HttpException, HttpStatus } from '@nestjs/common';

// =================================================================================================
//                                        TYPE & INTERFACE
// =================================================================================================

/**
 * @interface DatabaseError
 * @description Represents a generic database error structure.
 */
interface DatabaseError extends Error {
  code: string;
  detail?: string;
  column?: string;
  constraint?: string;
  table?: string;
  routine?: string;
}

/**
 * @interface NormalizedError
 * @description Represents the structure of a normalized, frontend-friendly error.
 */
export interface NormalizedError {
  statusCode: HttpStatus;
  message: string;
  error: string;
  field?: string;
}

// =================================================================================================
//                                      ERROR MAPPING
// =================================================================================================

/**
 * @constant
 * @description Maps PostgreSQL error codes to HTTP status codes and error names.
 */
const POSTGRES_ERROR_MAP: Record<string, { status: HttpStatus; error: string }> = {
  '23505': { status: HttpStatus.CONFLICT, error: 'Conflict' }, // Unique violation
  '23503': { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' }, // Foreign key violation
  '23502': { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' }, // Not null violation
  '22P02': { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' }, // Invalid text representation
  '22001': { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' }, // String data right truncation
  '22007': { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' }, // Invalid datetime format
  '42703': { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Internal Server Error' }, // Undefined column
};

// =================================================================================================
//                                        HELPER CLASS
// =================================================================================================

/**
 * @class DatabaseExceptionHelper
 * @description Provides methods to identify and normalize PostgreSQL errors.
 */
export class DatabaseExceptionHelper {
  /**
   * @method isDatabaseError
   * @description Checks if an exception is a recognizable database error.
   * @param {unknown} exception - The exception to check.
   * @returns {boolean} - True if it's a database error, false otherwise.
   */
  public isDatabaseError(exception: unknown): exception is DatabaseError {
    return (
      exception instanceof Error &&
      'code' in exception &&
      typeof (exception as DatabaseError).code === 'string'
    );
  }

  /**
   * @method normalizeDbError
   * @description Converts a raw database error into a normalized HTTP exception.
   * @param {DatabaseError} exception - The raw database error.
   * @returns {HttpException} - A NestJS HttpException with a clean error structure.
   */
  public normalizeDbError(exception: DatabaseError): HttpException {
    const errorMapping =
      POSTGRES_ERROR_MAP[exception.code] || this.getDefaultError();
    const normalizedError = this.formatDatabaseErrorMessage(
      exception,
      errorMapping.status,
      errorMapping.error,
    );

    return new HttpException(normalizedError, errorMapping.status);
  }

  /**
   * @method formatDatabaseErrorMessage
   * @description Creates a frontend-friendly error message from a raw DB error.
   * @private
   */
  private formatDatabaseErrorMessage(
    exception: DatabaseError,
    status: HttpStatus,
    error: string,
  ): NormalizedError {
    const baseResponse: NormalizedError = {
      statusCode: status,
      message: 'A database error occurred.',
      error,
    };

    switch (exception.code) {
      case '23505': // Unique violation
        return this.formatUniqueViolation(exception, baseResponse);
      case '23503': // Foreign key violation
        return this.formatForeignKeyViolation(exception, baseResponse);
      case '23502': // Not null violation
        return this.formatNotNullViolation(exception, baseResponse);
      case '22P02': // Invalid text representation
        return this.formatInvalidInput(exception, baseResponse);
      default:
        // For unhandled specific codes, return a generic message to avoid leaking details.
        baseResponse.message =
          status === HttpStatus.INTERNAL_SERVER_ERROR
            ? 'An unexpected internal error occurred.'
            : 'A validation error occurred.';
        return baseResponse;
    }
  }

  // --------------------------- Message Formatters ---------------------------

  private formatUniqueViolation(
    exception: DatabaseError,
    response: NormalizedError,
  ): NormalizedError {
    const detail = exception.detail || '';
    const match = detail.match(/Key \((.*?)\)=\((.*?)\) already exists\./);

    if (match) {
      const [_, key, value] = match;
      response.message = `The ${key} '${value}' is already taken.`;
      response.field = key;
    } else {
      // Fallback for different unique violation formats
      response.message = 'A record with the provided details already exists.';
      if (exception.constraint) {
        response.field = this.extractFieldFromConstraint(
          exception.constraint,
          '_key',
        );
      }
    }
    return response;
  }

  private formatForeignKeyViolation(
    exception: DatabaseError,
    response: NormalizedError,
  ): NormalizedError {
    const detail = exception.detail || '';
    const match = detail.match(/Key \((.*?)\)=\((.*?)\) is not present in table "(.*?)"\./);

    if (match) {
      const [_, key, value, table] = match;
      response.message = `Invalid value '${value}' for field '${key}'. The specified ${this.singularize(table)} does not exist.`;
      response.field = key;
    } else {
      response.message =
        'A related record could not be found. Please check your input.';
    }
    return response;
  }

  private formatNotNullViolation(
    exception: DatabaseError,
    response: NormalizedError,
  ): NormalizedError {
    if (exception.column) {
      response.message = `The field '${exception.column}' cannot be empty.`;
      response.field = exception.column;
    } else {
      response.message = 'A required field is missing.';
    }
    return response;
  }

  private formatInvalidInput(
    exception: DatabaseError,
    response: NormalizedError,
  ): NormalizedError {
    response.message = 'Invalid format for one of the fields.';
    const routine = exception.routine || '';
    // Example: "uuid_in", "int4in" -> extract "uuid", "int"
    if (routine.endsWith('_in')) {
      const type = routine.slice(0, -3);
      response.message = `Invalid input syntax for type ${type}. Please provide a valid value.`;
      // We can't easily get the column name here, so we don't set response.field
    }
    return response;
  }

  // --------------------------- Utility Methods ---------------------------

  private getDefaultError() {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    };
  }

  private extractFieldFromConstraint(
    constraint: string,
    suffix: string,
  ): string | undefined {
    if (constraint.endsWith(suffix)) {
      return constraint.slice(0, -suffix.length);
    }
    // Example: "users_email_unique" -> "email"
    const parts = constraint.split('_');
    if (parts.length > 2) {
      return parts.slice(1, -1).join('_');
    }
    return undefined;
  }

  private singularize(str: string): string {
    return str.endsWith('s') ? str.slice(0, -1) : str;
  }
}
