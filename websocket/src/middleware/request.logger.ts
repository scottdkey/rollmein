import { NextFunction, Request, Response } from "express";
import { container } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";

export const RequestLogger = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const logger = container.get(LoggerService).getLogger("request logger");
  logger.debug({
    headers: req.headers,
    body: req.body,
    params: req.params,
    ip: req.ip,
  });
  next();
};
