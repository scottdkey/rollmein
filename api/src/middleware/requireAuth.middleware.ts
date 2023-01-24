
import { MyContext } from "../types/Context";
import { HTTPCodes } from "../types/HttpCodes.enum";
import { AuthorizationErrorResponse } from "../utils/errorsHelpers";
import { Next } from "koa";
import { container } from "../container";
import { LoggerService } from "../common/logger.service";


const logger = container.get(LoggerService).getLogger('RequireAuth')


export async function RequireAuth(ctx: MyContext<any, any>, next: Next) {
  try {
    if (ctx.state.validUser === false) {
      ctx.body = AuthorizationErrorResponse
      ctx.status = HTTPCodes.UNAUTHORIZED
    }
  } catch (e) {
    logger.error({
      message: "error in require auth",
      error: e.message,
      stacktrace: e.stacktrace
    })
    ctx.body = AuthorizationErrorResponse
    ctx.status = HTTPCodes.UNAUTHORIZED

  }
  await next()

}