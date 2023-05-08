import { UserService } from './user.service';
import { container } from '../container';
import Router from 'koa-router'
import { DefaultState, Next } from 'koa';
import { SessionService } from '../session/session.service';
import { PlayerService } from '../player/player.service';
import { RequireAuth } from '../common/middleware/requireAuth.middleware';
import { MyContext } from '../../../shared/types/Context';
import { HTTPCodes } from '../../../shared/types/HttpCodes.enum';
import { isAuth } from '../common/middleware/isAuth';

const router = new Router<DefaultState, MyContext<any, any>>({ prefix: '/user' })
const userService = container.get(UserService)
const sessionService = container.get(SessionService)
const playerService = container.get(PlayerService)


router.get('/me', RequireAuth, async (ctx, next) => {
  const user = ctx.state.user
  if (user) {
    ctx.body = {
      user: userService.scrubUser(ctx.state.user),
      success: true
    }
    ctx.status = HTTPCodes.OK
  }

  await next()

})

router.put('/profile', isAuth, RequireAuth, async (ctx: MyContext<{ username: string }, ScrubbedUser | { error: string }>, next: Next) => {
  try {
    const username = ctx.request.body.username

    const sessionId = ctx.state.token as string

    const res = await userService.updateProfile(username)

    if (sessionId && res.user && res.scrubbedUser) {
      await sessionService.setSession(sessionId, res.user)
      ctx.status = HTTPCodes.OK
      ctx.body = res.scrubbedUser
    }

    if (!sessionId) {
      ctx.status = HTTPCodes.INTERNAL_SERVER_ERROR
      ctx.body = {
        error: "Error updating profile"
      }
    }

  } catch (e) {
    ctx.throw(HTTPCodes.SERVER_ERROR, e)
  }

  await next()
})

router.get("/player", RequireAuth, async (ctx: MyContext<{}, IPlayer | { error: string }>, next: Next) => {
  try {
    const userId = ctx.state.user?.id as string
    const player = await playerService.getPlayerByUserId(userId)
    if (player) {
      ctx.status = HTTPCodes.OK
      ctx.body = player
    }
    if (!player) {
      ctx.status = HTTPCodes.NOT_FOUND
      ctx.body = {
        error: "No player found"
      }
    }

    await next()

  } catch (e) {
    throw (HTTPCodes.SERVER_ERROR, e)
  }
})


export default router