import { UserService } from './user.service';
import { container } from '../container';
import Router from 'koa-router'
import { isAuth } from '../middleware/isAuth';
import { Next } from 'koa';
import { MyContext } from '../types/context';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { ScrubbedUser } from '../types/user';
import { AuthService } from '../auth/auth.service';

const router = new Router({ prefix: '/user' })
const userService = container.get(UserService)
const authService = container.get(AuthService)

router.get('/me', isAuth, async (ctx: MyContext<null, ScrubbedUser | { message: string }>, next: Next) => {
  if (ctx.state.user && ctx.state.validUser) {
    ctx.body = userService.scrubResponse(ctx.state.user)
    ctx.status = HTTPCodes.OK
  }
  if (!ctx.state.user) {
    ctx.status = HTTPCodes.UNAUTHORIZED
    ctx.body = {
      message: "not authorized to access this endpoint"
    }
  }
  await next()

})

router.post('/profile', isAuth, async (ctx: MyContext<{ username: string }, ScrubbedUser | null>, next: Next) => {
  try {
    const username = ctx.request.body.username
    const sessionId = ctx.state.token
    const res = await userService.updateProfile(username)
    if (res.data && sessionId) {
      await authService.updateSession(sessionId, res.data)
      ctx.status = HTTPCodes.OK
      ctx.body = userService.scrubResponse(res.data)
    }

  } catch (e) {
    ctx.status = HTTPCodes.FAILED_DEPENDENCY
    ctx.body = null
  }

  await next()
})

export default router