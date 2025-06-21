import Joi from "joi";
import constant from '../../config/constant.js';

export const AuthenticationValidator = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(constant.MAX_LEN_PW).required(),
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    phoneWA: Joi.string().optional(),
    password: Joi.string().max(constant.MAX_LEN_PW).required(),
    confirm_password: Joi.string()
      .max(constant.MAX_LEN_PW)
      .valid(Joi.ref('password'))
      .messages({
        'any.only': 'Konfirmasi password tidak cocok dengan password',
      })
      .required(),
  }).custom((values) => {
    const { confirm_password, ...rest } = values;
    return rest;
  }),

  refresh: Joi.object({
    refresh_token: Joi.string().required(),
  }),
};

export default AuthenticationValidator;
