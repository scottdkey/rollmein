import { CheckAuthHeaderMiddleware } from '../middleware/validateAuth.middleware';
import Router from 'koa-router'
import { container } from '../container';
import { AuthService } from './auth.service';
import { MyContext } from '../types/context';
import { ScrubbedUser } from '../types/user';
import { ApplicationErrorResponse } from '../utils/errorsHelpers';
import { UserService } from '../user/user.service';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { isAuth } from '../middleware/isAuth';

const authService = container.get(AuthService)
const userService = container.get(UserService)
const authRouter = new Router({ prefix: '/auth' })

export interface ValidateRequestBody {
  accessToken: string
  refreshToken: string
  expirationTime: number
}

authRouter.post("/validate", CheckAuthHeaderMiddleware, async (ctx: MyContext<ValidateRequestBody, ScrubbedUser | AppError>, next) => {
  try {
    const tokenValid = ctx.state.token === ctx.request.body.accessToken
    const firebaseInfo = ctx.state.firebaseInfo
    const body = ctx.request.body

    const res = tokenValid && firebaseInfo && await authService.ensureUserExists(body, firebaseInfo)

    if (res && res.success && res.data) {
      const { cookieName, cookieOptions, sessionId } = await authService.login(res.data)
      ctx.cookies.set(cookieName, sessionId, cookieOptions)
      ctx.body = userService.scrubResponse(res.data)
      ctx.status = HTTPCodes.OK
    }

    if (res && !res.success && res.error) {
      ctx.body = res.error
      ctx.status = HTTPCodes.FAILED_DEPENDENCY
    }

  } catch (e) {
    const error = ApplicationErrorResponse(new Error('application error occurred', e))
    ctx.throw(HTTPCodes.SERVER_ERROR, error)
  }
  await next()

})

authRouter.delete('/logout', isAuth, async (ctx: MyContext<{}, { success: boolean }>, next) => {
  try {
    if (ctx.state.token) {
      authService.clearSession(ctx.state.token)
    }
    const { cookieName, cookieOptions, sessionId } = authService.logout()
    ctx.cookies.set(cookieName, sessionId, cookieOptions)
    ctx.body = {
      success: true
    }
    ctx.status = HTTPCodes.OK
  } catch (e) {
    ctx.body = {
      success: false
    }
    ctx.status = HTTPCodes.SERVER_ERROR

  }
  await next()
})

export default authRouter