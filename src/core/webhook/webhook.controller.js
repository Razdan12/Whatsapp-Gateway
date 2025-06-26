import BaseController from '../../base/controller.base.js';
import { NotFound } from '../../exceptions/catch.execption.js';
import webhookService from './webhook.service.js';

class webhookController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new webhookService();
  }

  findAll = this.wrapper(async (req, res) => {
    const userId = req.user.id;
    if (!userId) throw new NotFound('User tidak ditemukan');

    const data = await this.#service.findAll({ ...req.query, userId });
    return this.ok(res, data, 'Banyak webhook berhasil didapatkan');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound('webhook tidak ditemukan');

    return this.ok(res, data, 'webhook berhasil didapatkan');
  });

  create = this.wrapper(async (req, res) => {
    const userId = req.user.id;
    if (!userId) throw new NotFound('User tidak ditemukan');
    const data = await this.#service.create({ ...req.body, userId });
    return this.created(res, data, 'webhook berhasil dibuat');
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, 'webhook berhasil diperbarui');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'webhook berhasil dihapus');
  });
}

export default webhookController;
