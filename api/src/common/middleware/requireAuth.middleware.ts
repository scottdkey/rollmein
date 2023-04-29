import { Next } from "koa";
import { container } from "../../container";
import { LoggerService } from "../../logger/logger.service";
import { MyContext } from "../../types/Context";
import { HTTPCodes } from "../../types/HttpCodes.enum";
import { IApplicationError } from "../../types/ApplicationError";
import { ErrorMessages } from "../../utils/ErrorTypes.enum";
import { ErrorTypes } from "../../types/ErrorCodes.enum";



const logger = container.get(LoggerService).getLogger('RequireAuth')


export async function RequireAuth(ctx: MyContext<any, IApplicationError | null>, next: Next) {
  try {
    if (ctx.state.validUser === false) {
      ctx.body = {
        message: ErrorMessages.AuthorizationError,
        type: ErrorTypes.AUTH_ERROR,
        context: "RequireAuth"
      }
      ctx.status = HTTPCodes.UNAUTHORIZED
    }
  } catch (e) {
    logger.error({
      message: "error in require auth",
      error: e.message,
      stacktrace: e.stacktrace
    })
    ctx.body = {
      message: ErrorMessages.AuthorizationError,
      type: ErrorTypes.AUTH_ERROR,
      context: "RequireAuth"
    }
    ctx.status = HTTPCodes.UNAUTHORIZED

  }
  await next()

}