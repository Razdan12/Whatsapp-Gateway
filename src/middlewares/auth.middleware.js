import httpStatus from 'http-status-codes';
import { ApiError } from '../exceptions/errors.exception.js';
import { verifyToken } from '../helpers/jwt.helper.js';
import { Unauthenticated } from '../exceptions/catch.execption.js';
import prisma from '../config/prisma.db.js';

export default function auth(roles) {
  return async (req, res, next) => { 
    try {
      const authorization =
        req.headers.authorization !== undefined
          ? req.headers.authorization.split(' ')
          : [];
      if (authorization[1] === undefined)
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please Authenticate'
          )
        );

      let decoded;
      try {
        decoded = verifyToken(authorization[1]);
      } catch (e) {
        throw new Unauthenticated();
      }

      req.user = decoded;
      next();
    } catch (e) {
      if (e.message == 'jwt expired')
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_ACCESS',
            'Expired Login Session'
          )
        );

     
      return next(e);
    }
  };
}
