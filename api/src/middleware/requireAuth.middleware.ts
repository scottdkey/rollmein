import { MyContext } from "../types/Context";
import { AuthorizationErrorResponse } from "../utils/errorsHelpers";
import { HTTPCodes } from "../types/HttpCodes.enum";
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