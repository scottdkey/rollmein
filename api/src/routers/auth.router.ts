import { CheckAuthHeaderMiddleware } from './../middleware/validateAuth.middleware';
import Router from 'koa-router'
import { container } from '../container';
import { AuthService } from '../services/auth.service';
import { MyContext } from '../types/context';
import { User } from '../types/user';
import { ApplicationErrorResponse } from '../utils/errorsHelpers';

const authService = container.get(AuthService)
const authRouter = new Router({ prefix: '/auth' })

export interface ValidateRequestBody {
  accessToken: string
  refreshToken: string
  expirationTime: number
}

authRouter.post("/validate", CheckAuthHeaderMiddleware, async (ctx: MyContext<ValidateRequestBody, User>, next) => {
  try {
    const tokenValid = ctx.state.token === ctx.request.body.accessToken
    if (tokenValid && ctx.state.firebaseInfo) {

      const user = await authService.ensureUserExists(ctx.request.body, ctx.state.firebaseInfo)
      console.log(user)
      ctx.body = user
      ctx.status = 200
    }
    if (!tokenValid) {
      ctx.body = ApplicationErrorResponse(new Error('token not valid'))
      ctx.status = 401
    }

  } catch (e) {
    console.error(e)
    ctx.body = ApplicationErrorResponse(new Error('application error occurred', e))
    ctx.status = 500
  }
  next()
})

export default authRouter