import Joi from "joi";

export const WhatsappValidator = {
  sendMessage: Joi.object({
    number: Joi.string().required(),
    message: Joi.string().required()
  }),
  sendMedia: Joi.object({
    number: Joi.string().required(),
    type: Joi.string().required(),
    caption: Joi.string().optional()
  }),
};

export default WhatsappValidator;
