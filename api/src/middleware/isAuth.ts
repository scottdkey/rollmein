import { AuthorizationError } from '../utils/errorsHelpers';
import { Next } from "koa";
import { MyContext } from "../types/context";
import { container } from '../container';
import { LoggerService } from '../common/logger.service';
import { ConfigService } from '../common/config.service';
import { SessionService } from '../session/session.service';

const serverConfig = container.get(ConfigService).ServerConfig()
const sessionService = container.get(SessionService)
const logger = container.get(LoggerService).getLogger('isAuthLogger')

export async function isAuth(ctx: MyContext<any, any>, next: Next) {
  try {
    const cookie = ctx.cookies.get(serverConfig.cookieName)
    if (cookie) {
      const session = await sessionService.getSession(cookie)
      const cookieName = serverConfig.cookieName
      const cookieOptions = sessionService.cookieOptions()

      if (session.data && session.success) {
        ctx.state.user = session.data
        ctx.state.token = cookie
        ctx.state.validUser = session.success
      }

      if (!session.success) {
        ctx.cookies.set(cookieName, null, cookieOptions)
      }
    }
  } catch (e) {
    logger.error({ message: AuthorizationError.message, error: e.message })
    ctx.state.validUser = false
    ctx.state.user = null
    ctx.state.token = null
  }
  await next()

}