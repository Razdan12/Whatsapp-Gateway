import { Router } from 'express';
import multer from 'multer';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import WhatsappController from './whatsapp.controller.js';
import WhatsappValidator from './whatsapp.validator.js';
import auth from '../../middlewares/auth.middleware.js';
import authWa from '../../middlewares/whatsappAuth.midleware.js';

const r = Router(),
  validator = WhatsappValidator,
  controller = new WhatsappController();
const upload = multer({ dest: 'uploads/' });

r.get('/qr', controller.getQr);

r.get('/start', auth([]), controller.startWhatsapp);

r.post(
  '/send-message',
  authWa(),
  validatorMiddleware({ body: validator.sendMessage }),
  controller.sendMessage
);
r.post(
  '/send-media',
  authWa(),
  upload.single('media'),
  validatorMiddleware({ body: validator.sendMedia }),
  controller.sendMedia
);

const whatsappRouter = r;
export default whatsappRouter;
