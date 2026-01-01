import * as Joi from 'joi';

export const swaggerValidationSchema = Joi.object({
    SWAGGER_ENABLED: Joi.boolean()
      .truthy('true').truthy('1')
      .falsy('false').falsy('0')
      .empty('')
      .default(false),

    SWAGGER_TITLE: Joi.string().when('SWAGGER_ENABLED', {
      is: true,
      then: Joi.string().min(1).required(),
      otherwise: Joi.string().optional().allow('', null),
    }),

    SWAGGER_DESCRIPTION: Joi.string().when('SWAGGER_ENABLED', {
      is: true,
      then: Joi.string().min(1).required(),
      otherwise: Joi.string().optional().allow('', null),
    }),

    SWAGGER_VERSION: Joi.string().when('SWAGGER_ENABLED', {
      is: true,
      then: Joi.string().min(1).required(),
      otherwise: Joi.string().optional().allow('', null),
    }),

    SWAGGER_PATH: Joi.string().when('SWAGGER_ENABLED', {
      is: true,
      then: Joi.string().min(1).required(),
      otherwise: Joi.string().optional().allow('', null),
    }),
});
