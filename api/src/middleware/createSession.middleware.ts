import { Next } from "koa"
import { AuthService } from "../auth/auth.service"
import { LoggerService } from "../common/logger.service"
import { container } from "../container"
import { MyContext } from "../types/context"
import { AuthorizationError } from "../utils/errorsHelpers"


const authService = container.get(AuthService)
const logger = container.get(LoggerService).getLogger('createSessionMiddleware')

export async function createSession(ctx: MyContext<any, any>, next: Next) {
  if(ctx.state.user && ctx.state.validUser){
    try {
      const { cookieName, cookieOptions, sessionId } = await authService.login(ctx.state.user)
      ctx.cookies.set(cookieName, sessionId, cookieOptions)
    } catch (e) {
      logger.error({ message: AuthorizationError.message, error: e.message })
    }
  }
  await next()

}