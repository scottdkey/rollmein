import { UserService } from './user.service';
import { container } from '../container';
import Router from 'koa-router'
import { DefaultState, Next } from 'koa';
import { MyContext } from '../types/context';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { ScrubbedUser } from '../types/user';
import { SessionService } from '../session/session.service';

const router = new Router<DefaultState, MyContext<any, any>>({ prefix: '/user' })
const userService = container.get(UserService)
const sessionService = container.get(SessionService)

router.get('/me', async (ctx: MyContext<null, { user: ScrubbedUser | null, success: boolean }>, next: Next) => {
  if (ctx.state.user && ctx.state.validUser) {
    ctx.body = {
      user: userService.scrubResponse(ctx.state.user),
      success: true
    }
    ctx.status = HTTPCodes.OK
  }
  if (!ctx.state.user) {
    ctx.status = HTTPCodes.UNAUTHORIZED
    ctx.body = {
      user: null,
      success: false
    }
  }
  await next()

})

router.post('/profile', async (ctx: MyContext<{ username: string }, ScrubbedUser | null>, next: Next) => {
  try {
    const username = ctx.request.body.username
    const sessionId = ctx.state.token
    const res = await userService.updateProfile(username)
    if (res.data && sessionId) {
      await sessionService.setSession(sessionId, res.data)
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