import { CheckAuthHeaderMiddleware } from '../middleware/validateAuth.middleware';
import Router from 'koa-router'
import { container } from '../container';
import { AuthService } from './auth.service';
import { MyContext } from '../types/context';

import { DefaultState, Next } from 'koa';
import { SessionService } from '../session/session.service';
import { ScrubbedUser } from '../types/user';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { ApplicationErrorResponse } from '../utils/errorsHelpers';
import { UserService } from '../user/user.service';
import { DataResponse } from '../types/DataResponse';
import { DateService } from '../common/date.service';
import { LoggerService } from '../common/logger.service';

const authService = container.get(AuthService)
const userService = container.get(UserService)
const sessionService = container.get(SessionService)
const date = container.get(DateService)
const authRouter = new Router<DefaultState, MyContext<any, any>>({ prefix: '/auth' })
const logger = container.get(LoggerService).getLogger('authRouter')

export interface ValidateRequestBody {
  accessToken: string
  refreshToken: string
  expirationTime: number
}

authRouter.post("/validate",
  CheckAuthHeaderMiddleware,
  async (ctx: MyContext<ValidateRequestBody, DataResponse<ScrubbedUser>>, next: Next) => {
    try {
      const tokenValid = ctx.state.token === ctx.request.body.accessToken
      const firebaseInfo = ctx.state.firebaseInfo
      const body = ctx.request.body

      if (tokenValid && firebaseInfo && body) {
        const res = await authService.validateAuth(firebaseInfo, body)
        if (res.success && res.user && res.sessionId) {
          const { name, options } = sessionService.getCookieInfo()
          logger.info({message: 'cookie options', options})
          ctx.state.user = {
            ...res.user,
            sessionExpires: ""
          }
          ctx.state.validUser = res.success
          ctx.body = {
            success: res.success,
            error: null,
            data: userService.scrubResponse(res.user)
          }
          ctx.status = HTTPCodes.OK
          ctx.cookies.set(name, res.sessionId, options)
        } else {
          logger.error({ message: 'failed to validate auth', firebaseInfo, tokenValid, res })
        }

      } else {
        logger.error({ message: 'failed to validate auth', firebaseInfo, tokenValid })
        ctx.status = HTTPCodes.FAILED_DEPENDENCY
        ctx.body = ApplicationErrorResponse(new Error('failed to validate auth'))
      }

    } catch (e) {
      logger.error({ message: 'unable to validate', error: e.message, stacktrace: e.stacktrace })
      ctx.body = ApplicationErrorResponse(new Error('unable to validate auth', e))
      ctx.status = HTTPCodes.SERVER_ERROR
    }

    await next()

  })

authRouter.delete('/logout', async (ctx, next) => {
  try {
    const { name, options } = sessionService.getCookieInfo()
    ctx.cookies.set(name, null, { ...options, expires: date.now() })
    if (ctx.state.token) {
      await sessionService.clearSession(ctx.state.token)
    }
    ctx.body = {
      success: true
    }
    ctx.status = HTTPCodes.OK
  } catch (e) {
    ctx.body = {
      success: false,
      message: e.message
    }
    ctx.status = HTTPCodes.SERVER_ERROR
  }
  await next()
})

export default authRouter