import { ConfigService } from './../services/config.service';
import { FirebaseService } from './../services/firebase.service';
import { Next } from "koa"
import { container } from "../container"
import { LoggerService } from "../services/logger.service"
import { MyContext } from "../types/context"
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { AuthorizationError } from '../utils/errorsHelpers';
import { HTTPCodes } from '../types/HttpCodes.enum';

const logger = container.get(LoggerService).getLogger('validate auth middleware')
const fb = container.get(FirebaseService)
const serverConfig = container.get(ConfigService).ServerConfig()

export const ValidateAuthMiddleware = async (ctx: MyContext<any, any>, next: Next) => {
  try {
    const authHeader = ctx.headers.authorization && ctx.headers.authorization as string
    const token = authHeader && authHeader.split('Bearer ')[1]
    if (token) {
      const payload = await fb.verifyToken(token)
      const valid = validPayload(payload)
      ctx.state.token = token
      ctx.state.user = payload
      ctx.state.validUser = true
      valid && ctx.cookies.set(serverConfig.cookieName, token, {
        httpOnly: true,
        domain: serverConfig.prod ? serverConfig.cors_uri : 'localhost',
        path: '/',
        secure: serverConfig.prod,
        sameSite: "lax",
        expires: new Date(new Date().getTime() + 3600000),
      });
    }
  } catch (e) {
    logger.error(AuthorizationError.message)
    logger.error(e)
    ctx.status = HTTPCodes.UNAUTHORIZED
    ctx.body = {
      data: null,
      error: AuthorizationError,
      success: false
    }
  }
  next()
}


const validPayload = (payload: DecodedIdToken) => {

  const expirationDate = new Date(payload.exp)
  const now = new Date()
  const issuer = payload.iss === 'https://securetoken.google.com/rollmein-c1698'
  const aud = payload.aud === 'rollmein-c1698'
  const exp = expirationDate > now

  return issuer && aud
}
