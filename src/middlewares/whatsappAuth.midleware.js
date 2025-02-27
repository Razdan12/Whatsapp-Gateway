import httpStatus from 'http-status-codes';
import { ApiError } from '../exceptions/errors.exception.js';
import { verifyToken } from '../helpers/jwt.helper.js';
import { Unauthenticated } from '../exceptions/catch.execption.js';
import prisma from '../config/prisma.db.js';

export default function authWa(roles) {
  return async (req, res, next) => {
    try {
      const apiToken = req.headers['x-api-key'];
      if (!apiToken) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please provide API token'
          )
        );
      }
      
      const user = await prisma.user.findUnique({
        where: { apiToken },
      });
      
      if (!user) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_DATA',
            'Invalid API token'
          )
        );
      }
    
      req.user = user;
      next();
    } catch (e) {
      if (e.message === 'jwt expired') {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_ACCESS',
            'Expired Login Session'
          )
        );
      }
      
      console.error(e);
      return next(e);
    }
  };
}
