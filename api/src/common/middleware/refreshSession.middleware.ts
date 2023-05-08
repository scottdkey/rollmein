import { Next } from "koa";
import { SessionService } from "../../session/session.service";
import { container } from "../../container";
import { LoggerService } from "../../logger/logger.service";
import { ConfigService } from "../config/config.service";
import { DateService } from "../date/date.service";
import { MyContext } from "../../../../shared/types/Context";


const sessionService = container.get(SessionService)
const date = container.get(DateService)
const serverConfig = container.get(ConfigService).serverConfig
const logger = container.get(LoggerService).getLogger('RefreshSession Logger')

export async function RefreshSession(ctx: MyContext<any, any>, next: Next) {
  console.error({
    authorization: ctx.req.headers
  })
  try {
    const user = ctx.state.user
    const valid = ctx.state.validUser
    //two days
    const lessThanTwoDaysLeft = user && date.lessThanNumberOfMinutesLeft(user.sessionExpires, 2880)
    const currentSessionToken = ctx.state.token

    if (user && valid && currentSessionToken && lessThanTwoDaysLeft) {
      const sessionId = await sessionService.createSession(user)
      const cookieName = serverConfig.cookieName
      const cookieOptions = sessionService.cookieOptions()
      ctx.cookies.set(cookieName, sessionId, cookieOptions)
      await sessionService.clearSession(currentSessionToken)
      ctx.state.token = sessionId
    }
  } catch (e) {
    logger.error({
      message: "error refreshing session",
      error: e
    })
  }
  await next()

}