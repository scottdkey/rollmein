import { Next, ParameterizedContext } from "koa";
import { LoggerService } from "../../logger/logger.service";
import { container } from "../../container";

const logger = container.get(LoggerService).getLogger("isAuthLogger");

export async function RequestLogger(ctx: ParameterizedContext, next: Next) {
  try {
    logger.info({
      message: "request",
      url: ctx.url,
      method: ctx.method,
      body: ctx.request.body,
    });
  } catch (e) {
    logger.error(e);
    throw e;
  }
  await next();
}
