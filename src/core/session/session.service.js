import BaseService from '../../base/service.base.js';
import prisma from '../../config/prisma.db.js';
import fs from 'fs/promises';
import { getClient } from '../../utils/whatsappClient.js';

class SessionService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.session.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.session.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findByUser = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.session.findMany({
      ...q,
      where: { userId: query.userId },
    });

    if (query.paginate) {
      const countData = await this.db.session.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.session.findFirst({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.session.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.session.update({ where: { id }, data: payload });
    return data;
  };
  getStatus = async (sessionId) => {
    const inMemory = !!getClient(sessionId);
    const dbSession = await this.db.session.findFirst({
      where: { id: sessionId },
      select: { status: true },
    });
    const connected = dbSession
  
    return connected;
  };

  delete = async (id) => {
    const data = await this.db.session.delete({ where: { id } });
    await fs.rm(`./auth_info/${id}`, {
      recursive: true,
      force: true,
    });
    return data;
  };
}

export default SessionService;
