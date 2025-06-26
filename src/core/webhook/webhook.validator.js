import Joi from 'joi';

export const webhookValidator = {
  create: Joi.object({
    url: Joi.string().required(),
    event: Joi.string().required(),
    SessionId: Joi.string().required(),
    method: Joi.string().required(),
    payload: Joi.string().optional(),
  }),
  update: Joi.object({
    url: Joi.string().optional(),
    event: Joi.string().optional(),
    SessionId: Joi.string().optional(),
    method: Joi.string().optional(),
    payload: Joi.string().optional(),
  }),
};

export default webhookValidator;
