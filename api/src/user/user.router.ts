import { UserService } from './user.service';
import { container } from '../container';
import Router from 'koa-router'
import { DefaultState, Next } from 'koa';
import { SessionService } from '../session/session.service';
import { MyContext } from '../types/Context';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { PlayerService } from '../player/player.service';
import { RequireAuth } from '../middleware/requireAuth.middleware';

const router = new Router<DefaultState, MyContext<any, any>>({ prefix: '/user' })
const userService = container.get(UserService)
const sessionService = container.get(SessionService)
const playerService = container.get(PlayerService)


router.get('/me', async (ctx, next) => {
  if (ctx.state.user && ctx.state.validUser) {
    ctx.body = {
      user: userService.scrubUser(ctx.state.user),
      success: true
    }
    ctx.status = HTTPCodes.OK
  }
  if (!ctx.state.user) {
    ctx.status = HTTPCodes.UNAUTHORIZED
    throw { user: null, success: false }
  }
  await next()

})

router.post('/profile', async (ctx: MyContext<{ username: string }, ScrubbedUser | null>, next: Next) => {
  try {
    const username = ctx.request.body.username
    const sessionId = ctx.state.token
    const res = await userService.updateProfile(username)
    if (res.success && res.data && res.user && sessionId) {
      await sessionService.setSession(sessionId, res.user)
      ctx.status = HTTPCodes.OK
      ctx.body = res.data
    }

  } catch (e) {
    ctx.status = HTTPCodes.FAILED_DEPENDENCY
    ctx.body = e
  }

  await next()
})

router.get("/player", RequireAuth, async (ctx: MyContext<{}, IPlayer | null>, next: Next) => {
  try {
    const userId = ctx.state.user?.id as string
    const player = await playerService.getPlayerByUserId(userId)
    if (player) {
      ctx.body = player
    }
    if (!player) {
      ctx.body = null
    }

    await next()

  } catch (e) {
    ctx.status = HTTPCodes.SERVER_ERROR
    ctx.body = e
  }
})


export default router