import httpStatus from 'http-status-codes';

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.statusCodes.UNAUTHORIZED;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.StatusCodes.FORBIDDEN;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class GeneralError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ValidationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.validationMessage = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ApiError extends Error {
  constructor(statusCode, codeName, message) {
    super(message);
    this.name = codeName;
    this.statusCode = statusCode;
    this.message = message;
  }
}

export {
  UnauthorizedError,
  GeneralError,
  ValidationError,
  ForbiddenError,
  ApiError,
};
