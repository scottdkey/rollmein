import { Next, ParameterizedContext } from "koa";
import { container } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";

const logger = container.get(LoggerService).getLogger("RequireAuth");

export async function RequireAuth(ctx: ParameterizedContext, next: Next) {
  const validUser = ctx.state.validUser;
  if (validUser === false) {
    ctx.status = HTTPCodes.NOT_AUTHORIZED;
    ctx.message = "no valid user";
    logger.error("unable to find valid user");
  }
  await next();
}
