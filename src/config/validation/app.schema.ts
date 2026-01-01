import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  APP_PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_VERSION: Joi.string().default('1'),
  ALLOWED_ORIGINS: Joi.string().default('*'),
});
