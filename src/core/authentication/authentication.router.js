import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import AuthenticationController from './authentication.controller.js';
import AuthenticationValidator from './authentication.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import authWa from '../../middlewares/whatsappAuth.midleware.js';
import auth from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = AuthenticationValidator,
  controller = new AuthenticationController();

r.post(
  '/login',
  validatorMiddleware({ body: validator.login }),
  controller.login
);

r.post(
  '/register',
  validatorMiddleware({ body: validator.register }),
  controller.register
);

r.get('/generate-token', auth(), controller.generateToken);


r.post(
  '/refresh',
  validatorMiddleware({ body: validator.refresh }),
  controller.refresh
);

const authenticationRouter = r;
export default authenticationRouter;
