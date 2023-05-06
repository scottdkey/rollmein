import { Next } from "koa";
import { container } from "../../container";
import { LoggerService } from "../../logger/logger.service";
import { IApplicationError } from "../../../../shared/types/ApplicationError";
import { MyContext } from "../../../../shared/types/Context";
import { ErrorTypes } from "../../../../shared/types/ErrorCodes.enum";
import { ErrorMessages } from "../../../../shared/types/ErrorTypes.enum";
import { HTTPCodes } from "../../../../shared/types/HttpCodes.enum";



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