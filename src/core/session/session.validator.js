import Joi from "joi";

export const SessionValidator = {
  create: Joi.object({
    name: Joi.string().required(),
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  }),
};

export default SessionValidator;
