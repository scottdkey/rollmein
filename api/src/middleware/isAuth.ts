import { AuthorizationError } from '../utils/errorsHelpers';
import { Next } from "koa";
import { container } from '../container';
import { LoggerService } from '../common/logger.service';
import { ConfigService } from '../common/config.service';
import { SessionService } from '../session/session.service';
import { MyContext } from '../../../types/Context';

const serverConfig = container.get(ConfigService).serverConfig
const sessionService = container.get(SessionService)
const logger = container.get(LoggerService).getLogger('isAuthLogger')

export async function isAuth(ctx: MyContext<any, any>, next: Next) {
  const sessionToken = ctx.headers.authorization
  logger.debug({
    message: "session",
    sessionToken
  })
  try {

    if (sessionToken) {
      const session = await sessionService.getSession(sessionToken)
      const cookieName = serverConfig.cookieName
      const cookieOptions = sessionService.cookieOptions()

      if (session.data && session.success) {
        ctx.state.user = session.data
        ctx.state.token = sessionToken
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