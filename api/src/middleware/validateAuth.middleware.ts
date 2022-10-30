import { FirebaseService } from '../common/firebase.service';
import { Next } from "koa"
import { container } from "../container"
import { LoggerService } from "../common/logger.service"
import { MyContext } from "../types/context"
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { AuthorizationError } from '../utils/errorsHelpers';
import { HTTPCodes } from '../types/HttpCodes.enum';

const logger = container.get(LoggerService).getLogger('validate auth middleware')
const fb = container.get(FirebaseService)

export async function CheckAuthHeaderMiddleware(ctx: MyContext<any, any>, next: Next) {
  try {
    const authHeader = ctx.headers.authorization && ctx.headers.authorization as string
    const token = authHeader && authHeader.split('Bearer ')[1]
    if (!ctx.state.validUser && token) {
      const payload = await fb.verifyToken(token)
      const valid = await validPayload(payload)

      if (payload && valid) {
        const transformPayload = await transformJwtToUser(payload)
        ctx.state.token = token
        ctx.state.firebaseInfo = transformPayload
        ctx.state.validUser = true
      }
    }
  } catch (e) {
    logger.error({ message: AuthorizationError.message, error: e.message })
    ctx.throw(HTTPCodes.UNAUTHORIZED, {
      data: null,
      error: AuthorizationError,
      success: false
    })
  }
  await next()
}

const transformJwtToUser = async (payload: DecodedIdToken) => {
  const firebaseId = payload.uid
  const hasGoogleId = payload.firebase.identities.hasOwnProperty('google.com')
  const googleId: string | null = hasGoogleId && payload.firebase.identities['google.com'][0] || null
  const hasAppleId = payload.firebase.identities.hasOwnProperty('apple.com')
  const appleId: string | null = hasAppleId && payload.firebase.identities['apple.com'][0] || null
  const email = payload.email || null

  return {
    firebaseId,
    email,
    googleId,
    appleId
  }
}


const validPayload = async (payload: DecodedIdToken) => {

  const expirationDate = new Date(payload.exp)

  const now = new Date()
  const issuer = payload.iss === 'https://securetoken.google.com/rollmein-c1698'
  const aud = payload.aud === 'rollmein-c1698'
  const exp = expirationDate > now
  console.log(exp, 'expiration valid')
  console.log('expiration Date', expirationDate, 'now', now)

  return issuer && aud
}
