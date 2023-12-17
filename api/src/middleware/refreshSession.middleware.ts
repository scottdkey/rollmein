import { Next, ParameterizedContext } from "koa";
import { SessionService } from "../session/session.service.js";
import { container } from "../container.js";
import { ConfigService } from "../config/config.service.js";
import { DateService } from "../date/date.service.js";

const sessionService = container.get(SessionService);
const date = container.get(DateService);
const serverConfig = container.get(ConfigService).serverConfig;

/**
 * This middleware is intended to refresh the internal session
 * @param ctx
 * @param next
 */
export async function RefreshSession(ctx: ParameterizedContext, next: Next) {
  const user = ctx.state.user;
  const valid = ctx.state.validUser;
  //two days
  const lessThanTwoDaysLeft =
    user && date.lessThanNumberOfMinutesLeft(user.sessionExpires, 2880);
  const currentSessionToken = ctx.state.token;

  if (user && valid && currentSessionToken && lessThanTwoDaysLeft) {
    const sessionId = await sessionService.createSession(user);
    const cookieName = serverConfig.cookieName;
    const cookieOptions = sessionService.cookieOptions();
    ctx.cookies.set(cookieName, sessionId, cookieOptions);
    await sessionService.clearSession(currentSessionToken);
    ctx.state.token = sessionId;
  }
  await next();
}
