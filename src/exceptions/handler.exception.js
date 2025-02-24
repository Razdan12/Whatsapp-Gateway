import httpStatus from 'http-status-codes';
import {
  ValidationError,
  UnauthorizedError,
  ApiError,
} from './errors.exception.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import fs from 'fs';

const APP_DEBUG = process.env.APP_DEBUG;

const errorHandler = (err, req, res, next) => {
  // delete uploaded files on request for storage efficiency
  if (err) {
    const uploaded = [];

    if (req.file) uploaded.push(req.file);
    if (req.files) {
      if (typeof req.files === 'object')
        Object.keys(req.files).forEach((field) => {
          req.files[field].forEach((file) => {
            uploaded.push(file);
          });
        });
      else if (Array.isArray(req.files))
        req.files.forEach((file) => uploaded.push(file));
    }

    if (uploaded.length)
      uploaded.forEach((up) => {
        fs.unlink(up.path, (err) => {
          if (err) {
            console.error('ERR(file): ', err);
          }
        });
      });
  }

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ValidationError) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    return res.json({
      errors: {
        status: httpStatus.StatusCodes.BAD_REQUEST,
        data: null,
        error: {
          code: err.name,
          message: err.validationMessage,
        },
      },
    });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    return res.json({
      errors: {
        status: res.statusCode,
        data: null,
        error: {
          code: err.name,
          message: err?.meta?.target || err,
        },
      },
    });
  }

  if (err instanceof ApiError) {
    return res.json({
      errors: {
        status: err.statusCode,
        data: null,
        error: {
          code: err.name,
          message: err.message,
        },
      },
    });
  }

  const statusCode =
    err.http_code ||
    err.statusCode ||
    httpStatus.StatusCodes.INTERNAL_SERVER_ERROR ||
    500;
  res.status(statusCode);

  return res.json({
    errors: {
      status: res.statusCode,
      data: null,
      error: {
        code: err.name,
        message: err.message,
        trace:
          APP_DEBUG && res.statusCode !== httpStatus.StatusCodes.NOT_FOUND
            ? err.stack
            : undefined,
      },
    },
  });
};

export default errorHandler;
