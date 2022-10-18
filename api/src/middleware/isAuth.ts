import { AuthorizationError } from '../utils/errorsHelpers';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { Next } from "koa";
import { MyContext } from "../types/context";
import { container } from '../container';
import { LoggerService } from '../services/logger.service';
import { ConfigService } from '../services/config.service';
import { FirebaseService } from '../services/firebase.service';

const serverConfig = container.get(ConfigService).ServerConfig()
const fb = container.get(FirebaseService)
const logger = container.get(LoggerService).getLogger('IndexLogger')

export async function isAuth<T>(ctx: MyContext<unknown, T>, next: Next): Promise<MyContext<unknown, T>> {
  const cookie = ctx.cookies.get(serverConfig.cookieName)
  if (cookie) {
    const payload = await fb.verifyToken(cookie)
    logger.debug({ message: `jwt ${payload}` })
    ctx.state.user = {
      email: payload.email || "undefined",
      id: "",
      googleId: payload.firebase.identities['google.com'].id || "undefined",
      appleId: payload.firebase.identities['apple'] || "undefined",
      username: "",
      firebaseId: payload.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    ctx.state.validUser = true
  }
  if (!ctx.state.user && !ctx.state.validUser) {
    logger.error({ message: AuthorizationError.message })
    ctx.status = HTTPCodes.UNAUTHORIZED
    ctx.body = {
      data: null,
      error: AuthorizationError,
      success: false
    }
  }
  return next()
}