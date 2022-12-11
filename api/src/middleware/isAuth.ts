import { AuthorizationError } from '../utils/errorsHelpers';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { Next } from "koa";
import { MyContext } from "../types/context";
import { container } from '../container';
import { LoggerService } from '../common/logger.service';
import { ConfigService } from '../common/config.service';
import { AuthService } from '../auth/auth.service';

const serverConfig = container.get(ConfigService).ServerConfig()
const authService = container.get(AuthService)
const logger = container.get(LoggerService).getLogger('IndexLogger')

export async function isAuth(ctx: MyContext<any, any>, next: Next) {
  try {
    const cookie = ctx.cookies.get(serverConfig.cookieName)
    if (cookie) {
      const user = await authService.getSession(cookie)
      ctx.state.user = user.data
      ctx.state.token = cookie
      ctx.state.validUser = true
    }
  } catch (e) {
    logger.error({ message: AuthorizationError.message, error: e.message })
    ctx.state.validUser = false
  }
  await next()

}