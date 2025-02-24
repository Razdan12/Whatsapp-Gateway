import fs from 'fs';
import path from 'path';
import { program } from 'commander';

program
  .option('--name <name>', 'Name of the folder to create')
  .option('--model-name <modelName>', 'Model name to use for file naming');

program.parse(process.argv);

const options = program.opts();

if (!options.name || !options.modelName) {
  console.error('Both --name and --model-name are required');
  process.exit(1);
}

const name = options.name;
const nameL = name.toLowerCase();
const modelName = options.modelName;
const basePath = path.join('./src/core', nameL);

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

const files = [
  {
    name: nameL + '.validator.js',
    content: `import Joi from "joi";

export const ${name}Validator = {
  create: Joi.object({
    // no-data
  }),
  update: Joi.object({
    // no-data
  }),
};

export default ${name}Validator;
`,
  },
  {
    name: nameL + '.router.js',
    content: `import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import ${name}Controller from "./${nameL}.controller.js";
import ${name}Validator from "./${nameL}.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = ${name}Validator,
  controller = new ${name}Controller();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  controller.create
  );
  
  r.put(
    "/update/:id",
    auth(['ADMIN']),
    validatorMiddleware({ body: validator.update }),
    controller.update
    );
    
r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const ${nameL}Router = r;
export default ${nameL}Router;
`,
  },
  {
    name: nameL + '.controller.js',
    content: `import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import ${name}Service from "./${nameL}.service.js";

class ${name}Controller extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new ${name}Service();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak ${name} berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("${name} tidak ditemukan");

    return this.ok(res, data, "${name} berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "${name} berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "${name} berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "${name} berhasil dihapus");
  });
}

export default ${name}Controller;
`,
  },
  {
    name: nameL + '.service.js',
    content: `import BaseService from "../../base/service.base.js";
import prisma from '../config/prisma.db.js';

class ${name}Service extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.${modelName}.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.${modelName}.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.${modelName}.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.${modelName}.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.${modelName}.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.${modelName}.delete({ where: { id } });
    return data;
  };
}

export default ${name}Service;  
`,
  },
];

files.forEach((file) => {
  fs.writeFileSync(path.join(basePath, file.name), file.content);
  console.log(`🏁 Created file: ${path.join(basePath, file.name)}`);
});

console.log(`✅ Generator completed for ${modelName}`);
