import BaseController from '../../base/controller.base.js';
import { NotFound } from '../../exceptions/catch.execption.js';
import SessionService from './session.service.js';

class SessionController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new SessionService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, 'Banyak Session berhasil didapatkan');
  });

  findByUser = this.wrapper(async (req, res) => {
    const userId = req.user.id;
    if (!userId) throw new NotFound('User tidak ditemukan');

    const data = await this.#service.findByUser({ ...req.query, userId });
    return this.ok(res, data, 'Banyak Session berhasil didapatkan');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound('Session tidak ditemukan');

    return this.ok(res, data, 'Session berhasil didapatkan');
  });

  create = this.wrapper(async (req, res) => {
    const userId = req.user.id;
    const data = await this.#service.create({ userId, ...req.body });
    return this.created(res, data, 'Session berhasil dibuat');
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, 'Session berhasil diperbarui');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'Session berhasil dihapus');
  });

  getStatus = this.wrapper(async (req, res) => {
    const data = await this.#service.getStatus(req.params.id);
    return this.ok(res, data, 'Session berhasil didapatkan');
  });
}

export default SessionController;
