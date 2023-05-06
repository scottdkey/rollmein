import { UserService } from './user.service';
import { container } from '../container';
import Router from 'koa-router'
import { DefaultState, Next } from 'koa';
import { SessionService } from '../session/session.service';
import { PlayerService } from '../player/player.service';
import { RequireAuth } from '../common/middleware/requireAuth.middleware';
import { MyContext } from '../../../shared/types/Context';
import { HTTPCodes } from '../../../shared/types/HttpCodes.enum';

const router = new Router<DefaultState, MyContext<any, any>>({ prefix: '/user' })
const userService = container.get(UserService)
const sessionService = container.get(SessionService)
const playerService = container.get(PlayerService)


router.get('/me', RequireAuth, async (ctx, next) => {
  ctx.body = {
    user: userService.scrubUser(ctx.state.user),
    success: true
  }
  ctx.status = HTTPCodes.OK
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