import jwt from 'jsonwebtoken';
import fs from 'fs';
import {
  GeneralError,
  UnauthorizedError,
} from '../exceptions/errors.exception.js';
import httpStatus from 'http-status-codes';

const privateKey = fs.readFileSync('secrets/private.pem', 'utf8');
const publicKey = fs.readFileSync('secrets/public.pem', 'utf8');

export const generateAccessToken = async (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '120m',
  });
};

export const getTokenExpires = async (token) => {
  const decoded = jwt.decode(token);

  if (decoded && decoded.exp) {
    return decoded.exp;
  } else {
    console.error('Failed to decode token or missing exp/iat fields');
    return null;
  }
};

export const generateRefreshToken = async (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    is_refresh: true,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '3d',
  });
};

export const generateResetPasswordToken = (userId) => {
  const payload = {
    uid: userId,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '60m',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, privateKey, { algorithms: ['RS256'] });
};
