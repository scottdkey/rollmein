import { Next, ParameterizedContext } from "koa";
import { SessionService } from "../session/session.service.js";
import { LoggerService } from "../logger/logger.service.js";
import { container } from "../container.js";

const sessionService = container.get(SessionService);
const logger = container.get(LoggerService).getLogger("isAuthLogger");

export async function isAuth(ctx: ParameterizedContext, next: Next) {
  try {
    ctx.state.user = null;
    ctx.state.token = null;
    ctx.state.validUser = false;
    const sessionToken = ctx.headers.authorization?.split(" ")[1];
    if (sessionToken) {
      const session = await sessionService.getSession(sessionToken);
      if (session) {
        await sessionService.refreshSession(sessionToken);
        ctx.state.user = session;
        ctx.state.token = sessionToken;
        ctx.state.validUser = true;
      }
    }
  } catch (e) {
    logger.error({ message: e.message });
    ctx.state.validUser = false;
  }
  await next();
}
