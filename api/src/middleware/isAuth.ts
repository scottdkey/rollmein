import { AuthorizationError } from '../utils/errorsHelpers';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { Next } from "koa";
import {MyContext} from "../types/context";
import { container } from '../container';
import { LoggerService } from '../services/logger.service';
import { ConfigService } from '../services/config.service';
import { FirebaseService } from '../services/firebase.service';

const serverConfig = container.get(ConfigService).ServerConfig()
const fb = container.get(FirebaseService)
const logger = container.get(LoggerService).getLogger('IndexLogger')

export async function isAuth<T>(ctx: MyContext<unknown, T>, next: Next): Promise<MyContext<unknown, T>> {
  const cookie = ctx.cookies.get(serverConfig.cookieName)
  if(cookie){
    const payload = await fb.verifyToken(cookie)
    logger.debug(`jwt ${payload}`)
    ctx.state.user = payload
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