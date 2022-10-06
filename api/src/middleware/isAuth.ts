import { AuthorizationError } from '../utils/errorsHelpers';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { Next } from "koa";
import { MiddlewareFn } from "type-graphql";
import {verifyJwt} from "../utils/jwtUtils";
import {MyContext} from "../types/context";
import { container } from '../container';
import { LoggerService } from '../services/logger.service';

export async function isAuth<T>(ctx: MyContext<unknown, T>, next: Next): Promise<MiddlewareFn<MyContext<unknown, T>>> {
  const authHeader = ctx.headers.authorization && ctx.headers.authorization?.split(' ')[1]
  const logger = container.get(LoggerService).getLogger('IndexLogger')
  if(authHeader){
    const decodedJwt = verifyJwt(authHeader)
    logger.debug(`jwt ${decodedJwt}`)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId: string = decodedJwt.user.id
    ctx.state.user = {
      id: userId
    }
    ctx.state.validUser = true
  }
  if (!ctx.state.user && !ctx.state.validUser) {
    logger.error(AuthorizationError.message)
    ctx.status = HTTPCodes.UNAUTHORIZED
    ctx.body = {
      data: null,
      error: AuthorizationError,
      success: false
    }
  }
  return next()
}