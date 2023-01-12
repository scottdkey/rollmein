
import { MyContext } from "../types/Context";
import { HTTPCodes } from "../types/HttpCodes.enum";
import { AuthorizationErrorResponse } from "../utils/errorsHelpers";
import { Next } from "koa";



export async function RequireAuth(ctx: MyContext<any, any>, next: Next) {
  try {
    if (ctx.state.validUser) {
      await next()
    }
  } catch (e) {
    ctx.body = AuthorizationErrorResponse
    ctx.status = HTTPCodes.UNAUTHORIZED
    await next()
  }


}