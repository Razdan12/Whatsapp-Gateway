import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import WhatsappService from "./whatsapp.service.js";

class WhatsappController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new WhatsappService();
  }

  getQr = this.wrapper(async (req, res) => {
    const data = await this.#service.getQRAuth();
    return this.ok(res, data, "QR Auth Berhasil di dapatkan");
  });

  sendMessage = this.wrapper(async (req, res) => {
    const data = await this.#service.sendMessage(req.body);
    return this.ok(res, data, "berhasil mengirim pesan");
  });

  sendMedia = this.wrapper(async (req, res) => {
    const payload = {
      ...req.body,
      filePath: req.file ? req.file.path : undefined,
    };
    
    const data = await this.#service.sendMedia(payload);
    return this.created(res, data, "Berhasil mengirim media");
  });

}

export default WhatsappController;
