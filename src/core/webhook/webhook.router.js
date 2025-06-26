import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import webhookController from "./webhook.controller.js";
import webhookValidator from "./webhook.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = webhookValidator,
  controller = new webhookController();

r.get(
  "/show-all",
  auth([]),
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth([]),
  validatorMiddleware({ body: validator.create }),
  controller.create
  );
  
  r.put(
    "/update/:id",
    auth([]),
    validatorMiddleware({ body: validator.update }),
    controller.update
    );
    
r.delete("/delete/:id", auth([]), controller.delete);

const webhookRouter = r;
export default webhookRouter;
