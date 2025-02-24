import BaseService from '../../base/service.base.js';
import { Forbidden } from '../../exceptions/catch.execption.js';
import { compare, hash } from '../../helpers/bcrypt.helper.js';
import { generateAccessToken } from '../../helpers/jwt.helper.js';
import prisma from '../../config/prisma.db.js';
import crypto from 'crypto';

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

    return { user: this.exclude(user, ['password']), token: access_token };
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

    return {
      data,
      message: 'Akun anda berhasil terdaftar! Silahkan verifikasi email anda',
    };
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
}

export default AuthenticationService;
