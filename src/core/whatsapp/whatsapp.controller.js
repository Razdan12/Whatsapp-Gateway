import BaseController from '../../base/controller.base.js';
import { NotFound } from '../../exceptions/catch.execption.js';
import WhatsappService from './whatsapp.service.js';
import SessionService from '../session/session.service.js';

class WhatsappController extends BaseController {
  #service;
  #session;

  constructor() {
    super();
    this.#service = new WhatsappService();
    this.#session = new SessionService();
  }

  startWhatsapp = this.wrapper(async (req, res) => {
    const { sessionId } = req.query;
    const io = req.app.get('io');
    const session = await this.#session.findById(sessionId);
    if (!session) return this.BadRequest(res, {}, 'sesi tidak ditemukan');
    await this.#service.startWhatsappClient(io, session.id);
    
    return this.ok(res, true, 'server whatsapp telah berjalan');
  });

  getQr = this.wrapper(async (req, res) => {
    const data = await this.#service.getQRAuth(req.query.id);
    return this.ok(res, data, 'QR Auth Berhasil di dapatkan');
  });

  sendMessage = this.wrapper(async (req, res) => {
    const data = await this.#service.sendMessage(req.body);
    return this.ok(res, data, 'berhasil mengirim pesan');
  });

  sendMedia = this.wrapper(async (req, res) => {
    const payload = {
      ...req.body,
      filePath: req.file ? req.file.path : undefined,
    };

    const data = await this.#service.sendMedia(payload);
    return this.created(res, data, 'Berhasil mengirim media');
  });
}

export default WhatsappController;
