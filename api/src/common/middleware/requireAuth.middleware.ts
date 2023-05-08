import { Next } from "koa";
import { MyContext } from "../../../../shared/types/Context";
import { HTTPCodes } from "../../../../shared/types/HttpCodes.enum";
import { container } from "../../container";
import { LoggerService } from "../../logger/logger.service";



const logger = container.get(LoggerService).getLogger('RequireAuth')


export async function RequireAuth(ctx: MyContext<any, any>, next: Next) {
  try {
    const validUser = ctx.state.validUser
    if (validUser === false) {
      ctx.throw(HTTPCodes.UNAUTHORIZED, "no valid user")
    }
    await next()
  } catch (e) {
    logger.error({
      message: "error in require auth",
      error: e.message,
      stack: e.stack
    })
    ctx.throw(HTTPCodes.UNAUTHORIZED, "requireAuth error")
  }
}