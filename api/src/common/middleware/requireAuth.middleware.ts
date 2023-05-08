import { Next } from "koa";
import { IApplicationError } from "../../../../shared/types/ApplicationError";
import { MyContext } from "../../../../shared/types/Context";
import { ErrorMessages } from "../../../../shared/types/ErrorTypes.enum";
import { HTTPCodes } from "../../../../shared/types/HttpCodes.enum";
import { container } from "../../container";
import { LoggerService } from "../../logger/logger.service";



const logger = container.get(LoggerService).getLogger('RequireAuth')


export async function RequireAuth(ctx: MyContext<any, IApplicationError | null>, next: Next) {
  try {
    if (ctx.state.validUser === false) {

      ctx.throw(HTTPCodes.UNAUTHORIZED, ErrorMessages.AuthorizationError)
    }
    if (ctx.state.validUser === true) {
      ctx.state = { ...ctx.state, user: ctx.state.user }
    }
  } catch (e) {
    logger.error({
      message: "error in require auth",
      error: e.message,
      stacktrace: e.stacktrace
    })
    ctx.throw(HTTPCodes.UNAUTHORIZED, ErrorMessages.AuthorizationError)

  }
  return await next()
}