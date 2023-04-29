import { RollService } from './roll.service';
import { container } from '../container';
import Router from "koa-router";
import { isAuth } from '../common/middleware/isAuth';
import { LoggerService } from '../logger/logger.service';
import { RequireAuth } from '../common/middleware/requireAuth.middleware';
import { MyContext } from '../types/Context';
import { HTTPCodes } from '../types/HttpCodes.enum';

const router = new Router({ prefix: '/roll' })

const rollService = container.get(RollService)
const logger = container.get(LoggerService).getLogger("rollRouter")

router.post('/addPlayer', isAuth, async (ctx: MyContext<IAddPlayerRequestBody, IAddPlayerReturnBody>, next) => {
  try {
    const res = await rollService.addPlayerToRoll(ctx.request.body)


    ctx.body = {
      success: res
    }
    ctx.status = HTTPCodes.CREATED

  } catch (e) {
    logger.error({
      message: "error adding player",
      ...e
    })
    ctx.body = {
      success: false
    }
    ctx.status = e.status
  }
  await next()
})

router.get('/inCount', isAuth, async (ctx: MyContext<IPlayerInCountRequestBody, any>, next) => {
  const requestBody = ctx.request.body
  const res = rollService.inCount(requestBody.players)
  ctx.body = {
    data: res,
    error: null,
    success: false
  }
  await next()
})

//@ts-ignore
router.post('start', isAuth, RequireAuth, async (ctx: MyContext<RollStartRequest, RollStartResponse>, next) => {
  const groupId = ctx.request.body.groupId
  try {

    if (groupId && ctx.state.validUser) {
      const userId = ctx.state.user.id as string
      console.log({ userId, groupId, logger })
      const res = await rollService.startRoll(groupId)
      ctx.body = res
    }

    if (!groupId) {
      ctx.body = { message: "must include a group id", success: false }
      ctx.status = HTTPCodes.BAD_REQUEST

    }
  } catch (e) {
    logger.error({
      message: "error on starting roll",
      error: e
    })
  }
  await next()
})


export default router


