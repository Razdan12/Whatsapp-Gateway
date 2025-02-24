import { catchResponse } from '../exceptions/catch.execption.js';

/**
 * @param {{body?: any, query?: any}} schemas
 */
const validatorMiddleware = ({ body, query }) => {
  return async (req, res, next) => {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      // Validasi req.body
      const bodyValue = body
        ? await body.validateAsync(req.body, options)
        : req.body;

      // Validasi req.query
      const queryValue = query
        ? await query.validateAsync(req.query, options)
        : req.query;

      req.body = bodyValue;
      req.query = queryValue;
      next();
    } catch (err) {
      return catchResponse(err, req, res);
    }
  };
};

export default validatorMiddleware;
