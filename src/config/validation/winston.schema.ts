import * as Joi from 'joi';

export const winstonValidationSchema = Joi.object({
  WINSTON_LEVEL: Joi.string().valid('info', 'error', 'warn', 'debug').default('info'),
  WINSTON_ERROR_LOG_FILENAME: Joi.string().default('logs/error.log'),
  WINSTON_COMBINED_LOG_FILENAME: Joi.string().default('logs/combined.log'),
});
