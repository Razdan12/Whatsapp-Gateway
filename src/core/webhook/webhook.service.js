import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';


class webhookService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.webhook.findMany({ ...q , where: { userId: query.userId },});

    if (query.paginate) {
      const countData = await this.db.webhook.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.webhook.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.webhook.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.webhook.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.webhook.delete({ where: { id } });
    return data;
  };
}

export default webhookService;  
