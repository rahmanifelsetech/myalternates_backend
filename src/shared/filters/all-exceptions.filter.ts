// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { HttpAdapterHost } from '@nestjs/core';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);

//   constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

//   catch(exception: unknown, host: ArgumentsHost): void {
//     const { httpAdapter } = this.httpAdapterHost;
//     const ctx = host.switchToHttp();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let responseBody: Record<string, any> = {
//       statusCode: status,
//       message: 'Internal server error',
//     };

//     if (exception instanceof HttpException) {
//       // Standard HTTP exception
//       status = exception.getStatus();
//       const res = exception.getResponse();
//       responseBody =
//         typeof res === 'string' ? { statusCode: status, message: res } : res as object;
//     } else if (this.isDatabaseError(exception)) {
//       // Database errors
//       status = this.getHttpStatusForDatabaseError(exception.code);
//       responseBody = {
//         statusCode: status,
//         message: this.formatDatabaseErrorMessage(exception),
//         error: this.getErrorNameForStatus(status),
//       };
//     } else {
//       // Unknown / uncaught errors
//       const errorMessage =
//         exception instanceof Error ? exception.message : String(exception);

//       this.logger.error(
//         `Unhandled Exception: ${errorMessage}`,
//         exception instanceof Error ? exception.stack : undefined,
//       );

//       // Log full object if possible
//       if (typeof exception === 'object' && exception !== null) {
//         try {
//           this.logger.error(`Exception Object: ${JSON.stringify(exception, null, 2)}`);
//         } catch {
//           // Ignore circular references
//         }
//       }

//       // Determine client-friendly message
//       const clientMessage =
//         typeof errorMessage === 'string' && errorMessage.startsWith('Failed query:')
//           ? 'Database query failed'
//           : 'Internal server error';

//       responseBody = { statusCode: status, message: clientMessage };
//     }

//     httpAdapter.reply(ctx.getResponse(), responseBody, status);
//   }

//   // ---------------- Database error helpers ----------------

//   private isDatabaseError(
//     exception: any,
//   ): exception is { code: string; detail?: string; column?: string } {
//     return exception && typeof exception.code === 'string' && exception.code.length === 5;
//   }

//   private getHttpStatusForDatabaseError(code: string): HttpStatus {
//     switch (code) {
//       case '23505': // Unique violation
//         return HttpStatus.CONFLICT;
//       case '23503': // Foreign key violation
//       case '23502': // Not null violation
//         return HttpStatus.BAD_REQUEST;
//       default:
//         return HttpStatus.INTERNAL_SERVER_ERROR;
//     }
//   }

//   private getErrorNameForStatus(status: HttpStatus): string {
//     switch (status) {
//       case HttpStatus.CONFLICT:
//         return 'Conflict';
//       case HttpStatus.BAD_REQUEST:
//         return 'Bad Request';
//       default:
//         return 'Internal Server Error';
//     }
//   }

//   private formatDatabaseErrorMessage(exception: {
//     code: string;
//     detail?: string;
//     column?: string;
//   }): string {
//     switch (exception.code) {
//       case '23505':
//         return this.formatUniqueViolationMessage(exception.detail);
//       case '23503':
//         return 'Referenced record not found.';
//       case '23502':
//         return `Field '${exception.column}' cannot be null.`;
//       default:
//         return 'Database error occurred.';
//     }
//   }

//   private formatUniqueViolationMessage(detail?: string): string {
//     if (!detail) return 'Record already exists.';
//     const match = detail.match(/Key \((.*?)\)=\((.*?)\) already exists/);
//     return match ? `${match[1]} '${match[2]}' already exists.` : detail;
//   }
// // }


// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { HttpAdapterHost } from '@nestjs/core';

// interface DatabaseError {
//   code: string;
//   detail?: string;
//   column?: string;
//   constraint?: string;
//   table?: string;
//   schema?: string;
//   severity?: string;
//   message?: string;
//   length?: number;
//   name?: string;
// }

// interface ErrorResponse {
//   statusCode: number;
//   message: string;
//   error: string;
//   timestamp: string;
//   path?: string;
//   details?: any;
// }


// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);
//   private readonly isProduction = process.env.NODE_ENV === 'production';

//   constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

//   catch(exception: unknown, host: ArgumentsHost): void {
//     const { httpAdapter } = this.httpAdapterHost;
//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';
//     let error = 'Internal Server Error';
//     let details: any = undefined;

//     console.log('Exception caught by AllExceptionsFilter:', exception);

//     // Handle standard HTTP exceptions
//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const response = exception.getResponse();
      
//       if (typeof response === 'string') {
//         message = response;
//         error = this.getErrorNameForStatus(status);
//       } else if (typeof response === 'object') {
//         message = (response as any).message || message;
//         error = (response as any).error || this.getErrorNameForStatus(status);
//         details = (response as any).details;
//       }
//     } 
//     // Handle PostgreSQL/Drizzle database errors
//     else if (this.isDatabaseError(exception)) {
//       const dbError = exception as DatabaseError;
//       status = this.getHttpStatusForDatabaseError(dbError.code);
//       message = this.formatDatabaseErrorMessage(dbError);
//       error = this.getErrorNameForStatus(status);

//       // Log detailed error for debugging
//       this.logger.error('Database Error Details:', {
//         code: dbError.code,
//         constraint: dbError.constraint,
//         table: dbError.table,
//         column: dbError.column,
//         detail: dbError.detail,
//         message: dbError.message,
//       });

//       // Include technical details in development
//       if (!this.isProduction) {
//         details = {
//           code: dbError.code,
//           constraint: dbError.constraint,
//           table: dbError.table,
//           column: dbError.column,
//           rawDetail: dbError.detail,
//         };
//       }
//     } 
//     // Handle unknown errors
//     else {
//       const errorMessage =
//         exception instanceof Error ? exception.message : String(exception);

//       this.logger.error('Unhandled Exception:', {
//         message: errorMessage,
//         stack: exception instanceof Error ? exception.stack : undefined,
//         type: exception?.constructor?.name,
//       });

//       // Try to extract useful info from error object
//       if (typeof exception === 'object' && exception !== null) {
//         try {
//           this.logger.debug('Exception Object:', JSON.stringify(exception, null, 2));
//         } catch {
//           // Ignore circular reference errors
//         }
//       }

//       message = this.isProduction 
//         ? 'Internal server error' 
//         : errorMessage;
//     }

//     const responseBody: ErrorResponse = {
//       statusCode: status,
//       message,
//       error,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       ...(details && { details }),
//     };

//     httpAdapter.reply(ctx.getResponse(), responseBody, status);
//   }

//   // ==================== Database Error Detection ====================

//   private isDatabaseError(exception: any): exception is DatabaseError {
//     // PostgreSQL errors have a 5-character SQLSTATE code
//     return (
//       exception &&
//       typeof exception === 'object' &&
//       typeof exception.code === 'string' &&
//       exception.code.length === 5
//     );
//   }

//   // ==================== HTTP Status Mapping ====================

//   private getHttpStatusForDatabaseError(code: string): HttpStatus {
//     // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
    
//     // Class 23 — Integrity Constraint Violation
//     if (code.startsWith('23')) {
//       switch (code) {
//         case '23505': // unique_violation
//           return HttpStatus.CONFLICT;
//         case '23503': // foreign_key_violation
//           return HttpStatus.BAD_REQUEST;
//         case '23502': // not_null_violation
//           return HttpStatus.BAD_REQUEST;
//         case '23514': // check_violation
//           return HttpStatus.BAD_REQUEST;
//         default:
//           return HttpStatus.BAD_REQUEST;
//       }
//     }

//     // Class 22 — Data Exception
//     if (code.startsWith('22')) {
//       return HttpStatus.BAD_REQUEST;
//     }

//     // Class 42 — Syntax Error or Access Rule Violation
//     if (code.startsWith('42')) {
//       return HttpStatus.BAD_REQUEST;
//     }

//     // Default to internal server error
//     return HttpStatus.INTERNAL_SERVER_ERROR;
//   }

//   // ==================== User-Friendly Messages ====================

//   private formatDatabaseErrorMessage(dbError: DatabaseError): string {
//     switch (dbError.code) {
//       case '23505': // Unique violation
//         return this.formatUniqueViolation(dbError);
      
//       case '23503': // Foreign key violation
//         return this.formatForeignKeyViolation(dbError);
      
//       case '23502': // Not null violation
//         return this.formatNotNullViolation(dbError);
      
//       case '23514': // Check constraint violation
//         return this.formatCheckViolation(dbError);
      
//       case '22001': // String data right truncation
//         return this.formatStringTooLong(dbError);
      
//       case '22P02': // Invalid text representation
//         return 'Invalid data format provided.';
      
//       case '42703': // Undefined column
//         return 'Invalid field specified.';
      
//       case '42P01': // Undefined table
//         return 'Resource not found.';
      
//       default:
//         return this.formatGenericError(dbError);
//     }
//   }

//   // ==================== Specific Error Formatters ====================

//   private formatUniqueViolation(dbError: DatabaseError): string {
//     const detail = dbError.detail || '';
//     const constraint = dbError.constraint || '';

//     // Try to extract field and value from detail
//     // Format: Key (field_name)=(value) already exists.
//     const match = detail.match(/Key \(([^)]+)\)=\(([^)]+)\) already exists/);
    
//     if (match) {
//       const field = this.humanizeFieldName(match[1]);
//       const value = match[2];
//       return `${field} '${value}' already exists.`;
//     }

//     // Try to get field from constraint name
//     if (constraint) {
//       const field = this.extractFieldFromConstraint(constraint);
//       return `${field} already exists.`;
//     }

//     return 'This record already exists.';
//   }

//   private formatForeignKeyViolation(dbError: DatabaseError): string {
//     const detail = dbError.detail || '';
//     const constraint = dbError.constraint || '';

//     // Check if it's a deletion violation
//     if (detail.includes('still referenced')) {
//       const match = detail.match(/Key \(([^)]+)\)=\(([^)]+)\) is still referenced/);
//       if (match) {
//         const field = this.humanizeFieldName(match[1]);
//         return `Cannot delete: ${field} is still being used by other records.`;
//       }
//       return 'Cannot delete: This record is still being referenced.';
//     }

//     // Check if it's an insertion/update violation
//     if (detail.includes('not present')) {
//       const match = detail.match(/Key \(([^)]+)\)=\(([^)]+)\) is not present/);
//       if (match) {
//         const field = this.humanizeFieldName(match[1]);
//         return `Invalid ${field}: Referenced record does not exist.`;
//       }
//       return 'Referenced record not found.';
//     }

//     return 'Invalid reference: Related record not found.';
//   }

//   private formatNotNullViolation(dbError: DatabaseError): string {
//     const column = dbError.column;
    
//     if (column) {
//       const field = this.humanizeFieldName(column);
//       return `${field} is required.`;
//     }

//     return 'Required field is missing.';
//   }

//   private formatCheckViolation(dbError: DatabaseError): string {
//     const constraint = dbError.constraint || '';
//     const detail = dbError.detail || '';

//     if (constraint) {
//       const field = this.extractFieldFromConstraint(constraint);
//       return `Invalid value for ${field}.`;
//     }

//     if (detail) {
//       return detail;
//     }

//     return 'Data validation failed.';
//   }

//   private formatStringTooLong(dbError: DatabaseError): string {
//     const column = dbError.column;
    
//     if (column) {
//       const field = this.humanizeFieldName(column);
//       return `${field} is too long.`;
//     }

//     return 'Input value is too long.';
//   }

//   private formatGenericError(dbError: DatabaseError): string {
//     // Use the message if available and user-friendly
//     if (dbError.message && !dbError.message.includes('syntax') && !dbError.message.includes('SQL')) {
//       return dbError.message;
//     }

//     return 'A database error occurred. Please check your input and try again.';
//   }

//   // ==================== Helper Functions ====================

//   private humanizeFieldName(fieldName: string): string {
//     // Convert snake_case to Title Case
//     return fieldName
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   }

//   private extractFieldFromConstraint(constraint: string): string {
//     // Common patterns:
//     // - users_email_unique -> email
//     // - users_username_key -> username
//     // - pk_users_id -> id
    
//     // Remove common prefixes/suffixes
//     let field = constraint
//       .replace(/^(pk_|fk_|uq_|chk_)/, '')
//       .replace(/_(unique|key|pkey|fkey|check)$/, '');

//     // If it's table_field format, extract field
//     const parts = field.split('_');
//     if (parts.length > 1) {
//       field = parts.slice(1).join('_');
//     }

//     return this.humanizeFieldName(field);
//   }

//   private getErrorNameForStatus(status: HttpStatus): string {
//     switch (status) {
//       case HttpStatus.BAD_REQUEST:
//         return 'Bad Request';
//       case HttpStatus.UNAUTHORIZED:
//         return 'Unauthorized';
//       case HttpStatus.FORBIDDEN:
//         return 'Forbidden';
//       case HttpStatus.NOT_FOUND:
//         return 'Not Found';
//       case HttpStatus.CONFLICT:
//         return 'Conflict';
//       case HttpStatus.UNPROCESSABLE_ENTITY:
//         return 'Unprocessable Entity';
//       case HttpStatus.INTERNAL_SERVER_ERROR:
//         return 'Internal Server Error';
//       default:
//         return 'Error';
//     }
//   }
// }


// // Good version below

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { HttpAdapterHost } from '@nestjs/core';
// import { ErrorResponse } from '../interfaces/core/response.type';

// interface DatabaseError {
//   code: string;
//   detail?: string;
//   column?: string;
//   constraint?: string;
//   table?: string;
//   schema?: string;
//   severity?: string;
//   message?: string;
//   length?: number;
//   name?: string;
// }

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);
//   private readonly isProduction = process.env.NODE_ENV === 'production';

//   constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

//   catch(exception: unknown, host: ArgumentsHost): void {
//     const { httpAdapter } = this.httpAdapterHost;
//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest();

//     /**
//      * ✅ Drizzle (and many ORMs) wrap PG errors inside `cause`
//      */
//     const rootException =
//       (exception as any)?.cause &&
//       typeof (exception as any).cause === 'object'
//         ? (exception as any).cause
//         : exception;

//     // ALWAYS log full internal error (never sent to client)
//     this.logInternalError(exception);

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';
//     let error = 'Internal Server Error';

//     // ---------------- HTTP Exceptions ----------------
//     if (exception instanceof HttpException) {
//       console.log('Handling HttpException:', exception);
//       status = exception.getStatus();
//       const response = exception.getResponse();

//       if (typeof response === 'string') {
//         message = response;
//         error = this.getErrorNameForStatus(status);
//       } else if (typeof response === 'object') {
//         message = (response as any).message || message;
//         error = (response as any).error || this.getErrorNameForStatus(status);
//       }
//     }
//     // ---------------- Database Errors (Postgres / Drizzle) ----------------
//     else if (this.isDatabaseError(rootException)) {
//       const dbError = rootException as DatabaseError;

//       status = this.getHttpStatusForDatabaseError(dbError.code);
//       message = this.formatDatabaseErrorMessage(dbError);
//       error = this.getErrorNameForStatus(status);
//     }
//     // ---------------- Unknown Errors ----------------
//     else {
//       const errorMessage =
//         exception instanceof Error ? exception.message : String(exception);

//       message = this.isProduction
//         ? 'Internal server error'
//         : errorMessage;
//     }

//     const responseBody: ErrorResponse = {
//       statusCode: status,
//       message,
//       error,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     };

//     httpAdapter.reply(ctx.getResponse(), responseBody, status);
//   }

//   // ==================== INTERNAL LOGGING ====================

//   private logInternalError(exception: any) {
//     try {
//       this.logger.error('Internal Exception', {
//         name: exception?.name,
//         message: exception?.message,
//         stack: exception?.stack,
//         query: exception?.query,
//         params: exception?.params,
//         cause: exception?.cause,
//       });
//     } catch {
//       this.logger.error('Failed to serialize exception for logging');
//     }
//   }

//   // ==================== Database Detection ====================

//   private isDatabaseError(exception: any): exception is DatabaseError {
//     return (
//       exception &&
//       typeof exception === 'object' &&
//       typeof exception.code === 'string' &&
//       exception.code.length === 5
//     );
//   }

//   // ==================== Status Mapping ====================

//   private getHttpStatusForDatabaseError(code: string): HttpStatus {
//     if (code.startsWith('23')) {
//       switch (code) {
//         case '23505':
//           return HttpStatus.CONFLICT;
//         case '23503':
//         case '23502':
//         case '23514':
//           return HttpStatus.BAD_REQUEST;
//         default:
//           return HttpStatus.BAD_REQUEST;
//       }
//     }

//     if (code.startsWith('22')) {
//       return HttpStatus.BAD_REQUEST;
//     }

//     return HttpStatus.INTERNAL_SERVER_ERROR;
//   }

//   // ==================== Messages ====================

//   private formatDatabaseErrorMessage(dbError: DatabaseError): string {
//     switch (dbError.code) {
//       case '23505':
//         return this.formatUniqueViolation(dbError);
//       case '23503':
//         return 'Referenced record does not exist.';
//       case '23502':
//         return `${this.humanizeFieldName(dbError.column || 'Field')} is required.`;
//       case '22P02':
//         return 'Invalid data format provided.';
//       default:
//         return 'A database error occurred.';
//     }
//   }

//   private formatUniqueViolation(dbError: DatabaseError): string {
//     const match = dbError.detail?.match(
//       /Key \(([^)]+)\)=\(([^)]+)\) already exists/
//     );

//     if (match) {
//       return `${this.humanizeFieldName(match[1])} '${match[2]}' already exists.`;
//     }

//     return 'This record already exists.';
//   }

//   // ==================== Helpers ====================

//   private humanizeFieldName(field: string): string {
//     return field
//       .split('_')
//       .map(w => w.charAt(0).toUpperCase() + w.slice(1))
//       .join(' ');
//   }

//   private getErrorNameForStatus(status: HttpStatus): string {
//     switch (status) {
//       case HttpStatus.BAD_REQUEST:
//         return 'Bad Request';
//       case HttpStatus.CONFLICT:
//         return 'Conflict';
//       case HttpStatus.NOT_FOUND:
//         return 'Not Found';
//       case HttpStatus.UNAUTHORIZED:
//         return 'Unauthorized';
//       default:
//         return 'Internal Server Error';
//     }
//   }
// }


import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorResponse } from '../interfaces/core/response.type';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

interface DatabaseError {
  code: string;
  detail?: string;
  column?: string;
  constraint?: string;
  table?: string;
  schema?: string;
  severity?: string;
  message?: string;
  length?: number;
  name?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isProduction = process.env.NODE_ENV === 'production';

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    /**
     * ✅ Drizzle (and many ORMs) wrap PG errors inside `cause`
     */
    const rootException =
      (exception as any)?.cause &&
      typeof (exception as any).cause === 'object'
        ? (exception as any).cause
        : exception;

    // ✅ ALWAYS log full internal error (never sent to client)
    this.logInternalError(exception, request);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // ---------------- Zod Validation Errors ----------------
    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError();

      if (zodError instanceof ZodError) {
        const response = ctx.getResponse();

        const fieldErrors = zodError.issues.reduce<Record<string, string>>(
          (acc, issue) => {
            const key = issue.path.join('.');
            acc[key] = issue.message;
            return acc;
          },
          {},
        );

        httpAdapter.reply(
          response,
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: fieldErrors,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
          HttpStatus.BAD_REQUEST,
        );

        return;
      }
    }
    // ---------------- HTTP Exceptions ----------------
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // /**
      //  * ✅ Explicit Zod validation handling
      //  */
      // if (
      //   typeof exceptionResponse === 'object' &&
      //   (exceptionResponse as any).type === 'ZOD_VALIDATION_ERROR'
      // ) {
      //   httpAdapter.reply(
      //     response,
      //     {
      //       statusCode: status,
      //       error: 'VALIDATION_ERROR',
      //       message: 'Validation failed',
      //       issues: (exceptionResponse as any).issues,
      //       timestamp: new Date().toISOString(),
      //       path: request.url,
      //     },
      //     status,
      //   );
      //   return;
      // }

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = this.getErrorNameForStatus(status);
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error =
          (exceptionResponse as any).error ||
          this.getErrorNameForStatus(status);
      }
    }

    // ---------------- Database Errors (Postgres / Drizzle) ----------------
    else if (this.isDatabaseError(rootException)) {
      const dbError = rootException as DatabaseError;

      status = this.getHttpStatusForDatabaseError(dbError.code);
      message = this.formatDatabaseErrorMessage(dbError);
      error = this.getErrorNameForStatus(status);
    }

    // ---------------- Unknown Errors ----------------
    else {
      const errorMessage =
        exception instanceof Error ? exception.message : String(exception);

      message = this.isProduction ? 'Internal server error' : errorMessage;
    }

    const responseBody: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    httpAdapter.reply(response, responseBody, status);
  }

  // ==================== INTERNAL LOGGING ====================

  private logInternalError(exception: any, req: any) {
    try {
      this.logger.error('Internal Exception', {
        requestId: req?.headers?.['x-request-id'],
        userId: req?.user?.id,
        app: req?.user?.app,
        path: req?.url,
        method: req?.method,
        name: exception?.name,
        message: exception?.message,
        stack: exception?.stack
          ?.split('\n')
          .slice(0, 10)
          .join('\n'),
        query: exception?.query,
        params: exception?.params,
        cause: exception?.cause?.message ?? exception?.cause,
      });
    } catch {
      this.logger.error('Failed to serialize exception for logging');
    }
  }

  // ==================== Database Detection ====================

  private isDatabaseError(exception: any): exception is DatabaseError {
    return (
      exception &&
      typeof exception === 'object' &&
      typeof exception.code === 'string' &&
      exception.code.length === 5
    );
  }

  // ==================== Status Mapping ====================

  private getHttpStatusForDatabaseError(code: string): HttpStatus {
    if (code.startsWith('23')) {
      switch (code) {
        case '23505':
          return HttpStatus.CONFLICT;
        case '23503':
        case '23502':
        case '23514':
          return HttpStatus.BAD_REQUEST;
        default:
          return HttpStatus.BAD_REQUEST;
      }
    }

    if (code.startsWith('22')) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // ==================== Messages ====================

  private formatDatabaseErrorMessage(dbError: DatabaseError): string {
    switch (dbError.code) {
      case '23505':
        return this.formatUniqueViolation(dbError);
      case '23503':
        return 'Referenced record does not exist.';
      case '23502':
        return `${this.humanizeFieldName(dbError.column || 'Field')} is required.`;
      case '22P02':
        return 'Invalid data format provided.';
      default:
        return 'A database error occurred.';
    }
  }

  private formatUniqueViolation(dbError: DatabaseError): string {
    const match = dbError.detail?.match(
      /Key \(([^)]+)\)=\(([^)]+)\) already exists/,
    );

    if (match) {
      return `${this.humanizeFieldName(match[1])} '${match[2]}' already exists.`;
    }

    return 'This record already exists.';
  }

  // ==================== Helpers ====================

  private humanizeFieldName(field: string): string {
    return field
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private getErrorNameForStatus(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      default:
        return 'Internal Server Error';
    }
  }
}
