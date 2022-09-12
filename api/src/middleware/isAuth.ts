import { AuthorizationError } from '../utils/errorsHelpers';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { Next } from "koa";
import { MiddlewareFn } from "type-graphql";
import {verifyJwt} from "../utils/jwtUtils";
import {MyContext} from "../types/context";

export async function isAuth<T>(ctx: MyContext<T>, next: Next): Promise<MiddlewareFn<MyContext<T>>> {
  const authHeader = ctx.headers.authorization && ctx.headers.authorization?.split(' ')[1]
  if(authHeader){
    const decodedJwt = verifyJwt(authHeader)
    console.log(decodedJwt)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId: string = decodedJwt.user.id
    ctx.state.user = {
      id: userId
    }
    ctx.state.validUser = true
  }
  if (!ctx.state.user && !ctx.state.validUser) {
    ctx.status = HTTPCodes.UNAUTHORIZED
    ctx.body = {
      data: null,
      error: AuthorizationError,
      success: false
    }
    throw new Error("not authenticated")
  }
  return next()
}