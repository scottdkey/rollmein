import { Next } from "koa";
import { ConfigService } from "../common/config.service";
import { DateService } from "../common/date.service";
import { LoggerService } from "../common/logger.service";
import { container } from "../container";
import { SessionService } from "../session/session.service";
import { MyContext } from "../types/context";

const sessionService = container.get(SessionService)
const date = container.get(DateService)
const serverConfig = container.get(ConfigService).ServerConfig()
const logger = container.get(LoggerService).getLogger('RefreshSession Logger')

export async function RefreshSession(ctx: MyContext<any, any>, next: Next) {
  try {
    const user = ctx.state.user
    const valid = ctx.state.validUser
    //two days
    const lessThanTwoDaysLeft = user && date.lessThanNumberOfMinutesLeft(user.sessionExpires, 2880)
    const currentSessionToken = ctx.state.token

    if (user && valid && currentSessionToken && lessThanTwoDaysLeft ) {
      const session = await sessionService.createSession(user)
      const cookieName = serverConfig.cookieName
      const cookieOptions = sessionService.cookieOptions()
      ctx.cookies.set(cookieName, session.id, cookieOptions)
      await sessionService.clearSession(currentSessionToken)
      ctx.state.token = session.id
    }
  } catch (e) {
    logger.error({
      message: "error refreshing session",
      error: e
    })
  }
  await next()

}