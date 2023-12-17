import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (_, res, next) => {
  res.send({ message: "index" });
  next();
});

export { indexRouter };
