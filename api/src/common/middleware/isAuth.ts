import { Next } from "koa";
import { SessionService } from "../../session/session.service";
import { LoggerService } from "../../logger/logger.service";
import { container } from "../../container";
import { MyContext } from "../../../../shared/types/Context";


const sessionService = container.get(SessionService)
const logger = container.get(LoggerService).getLogger('isAuthLogger')

export async function isAuth(ctx: MyContext<any, any>, next: Next) {
  try {
    const sessionToken = ctx.headers.authorization?.split(" ")[1]
    if (sessionToken) {

      const session = await sessionService.getSession(sessionToken)
      await sessionService.refreshSession(sessionToken)
      ctx.state.user = session
      ctx.state.token = sessionToken
      ctx.state.validUser = session !== null
    }
  } catch (e) {
    logger.error({ message: e.message })
    ctx.state.validUser = false
    ctx.state.user = null
    ctx.state.token = null
  }
  await next()

}