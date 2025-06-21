import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import SessionController from "./session.controller.js";
import SessionValidator from "./session.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = SessionValidator,
  controller = new SessionController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get(
  "/show-by-user",
  auth([]),
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findByUser
);

r.get("/show-one/:id", controller.findById);
r.get("/check-status/:id", controller.getStatus);

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

const sessionRouter = r;
export default sessionRouter;
