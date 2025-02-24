import BaseService from "../../base/service.base.js";
import { prism } from "../../config/prisma.db.js";

class UserService extends BaseService {
  constructor() {
    super(prism);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.user.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.user.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.user.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.user.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.user.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.user.delete({ where: { id } });
    return data;
  };
}

export default UserService;  
