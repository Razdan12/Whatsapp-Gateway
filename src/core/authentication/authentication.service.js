import BaseService from '../../base/service.base.js';
import { Forbidden } from '../../exceptions/catch.execption.js';
import { compare, hash } from '../../helpers/bcrypt.helper.js';
import { generateAccessToken, generateRefreshToken } from '../../helpers/jwt.helper.js';
import prisma from '../../config/prisma.db.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class AuthenticationService extends BaseService {
  constructor() {
    super(prisma);
  }

  login = async (payload) => {
    const user = await this.db.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new NotFound('Akun tidak ditemukan');

    const pwValid = await compare(payload.password, user.password);
    if (!pwValid) throw new BadRequest('Password tidak cocok');

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user);
    return {
      user: this.exclude(user, ['password', 'apiToken', 'isVerified']),
      token: { access_token, refresh_token },
    };
  };

  register = async (payload) => {
    const verifyEmail = await this.db.user.findUnique({
      where: { email: payload.email },
    });

    if (verifyEmail) throw new Forbidden('Akun dengan email telah digunakan');
    const hashedPassword = await hash(payload.password);
    payload['password'] = hashedPassword;
    const data = await this.db.user.create({
      data: {
        ...payload,
      },
    });

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user);

    return { user: this.exclude(data, ['password']), token: { access_token, refresh_token } };
  };

  generateToken = async (id) => {
    const userData = await prisma.user.findFirst({
      where: {id},
    });
    if (!userData.apiToken) {
      const apiToken = crypto.randomBytes(32).toString('hex');
      const user = await prisma.user.update({
        where: { id },
        data: { apiToken },
      });
      return { apiToken: user.apiToken };
    } else return {apiToken: userData.apiToken};
  };


  refreshToken = async (refresh) => {
    const payload = jwt.decode(refresh);

    const user = await this.db.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new NotFound('Akun tidak ditemukan');

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user);
    return {
      user: this.exclude(user, ['password', 'apiToken', 'isVerified']),
      token: { access_token, refresh_token },
    };
  };
}

export default AuthenticationService;
