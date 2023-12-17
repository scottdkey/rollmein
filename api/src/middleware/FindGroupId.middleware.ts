import { Next } from "koa";
import { container } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";

const logger = container.get(LoggerService).getLogger("FindGroupIdMiddleware");

export async function HasGroupId(ctx: any, next: Next) {
  if (ctx.state.user && ctx.request.body) {
    const requestData = ctx.request.body;
    logger.info({ message: "", ...requestData });
  }
  return next();
}
