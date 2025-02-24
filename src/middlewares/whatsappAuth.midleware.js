import httpStatus from 'http-status-codes';
import { ApiError } from '../exceptions/errors.exception.js';
import { verifyToken } from '../helpers/jwt.helper.js';
import { Unauthenticated } from '../exceptions/catch.execption.js';
import prisma from '../config/prisma.db.js';

export default function authWa(roles) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please authenticate with JWT token'
          )
        );
      }
      
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please authenticate with JWT token'
          )
        );
      }
      
      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (e) {
        throw new Unauthenticated();
      }
      
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
    
      if (decoded.id && user.id !== decoded.id) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_DATA',
            'JWT token does not match API token'
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
