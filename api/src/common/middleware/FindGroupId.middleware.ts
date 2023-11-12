import { Next, ParameterizedContext } from "koa";
import { container } from "../../container";
import { LoggerService } from "../../logger/logger.service";

const logger = container.get(LoggerService).getLogger("FindGroupIdMiddleware");

export async function HasGroupId(
  ctx: ParameterizedContext,
  next: Next
): Promise<ParameterizedContext> {
  if (ctx.state.user && ctx.request.body) {
    const requestData = ctx.request.body;
    logger.info({ message: "", ...requestData });
  }
  return next();
}
