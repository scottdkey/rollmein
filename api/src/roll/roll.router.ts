import { RollService } from './roll.service';
import { container } from '../container';
import Router from "koa-router";
import { LoggerService } from '../logger/logger.service';
import { RequireAuth } from '../common/middleware/requireAuth.middleware';
import { MyContext } from '../../../shared/types/Context';
import { HTTPCodes } from '../../../shared/types/HttpCodes.enum';
import { RollUtilities } from './roll.utilities';

const router = new Router({ prefix: '/roll' })

const rollService = container.get(RollService)
const rollUtilities = container.get(RollUtilities)
// const groupCountService = container.get(GroupCountService)
const logger = container.get(LoggerService).getLogger("rollRouter")

router.get('/:groupId', RequireAuth, async (ctx: MyContext<any, any>, next) => {
  try {
    const groupId = ctx.params.groupId
    const userId = ctx.state.user.id as string
    if (!groupId) {
      ctx.message = "must include a group id"
      ctx.status = HTTPCodes.BAD_REQUEST
      ctx.body = null
    }
    if (groupId && userId) {
      const rollReturn = await rollService.getRoll(groupId, userId)
      ctx.body = rollReturn
      ctx.status = rollReturn ? HTTPCodes.OK : HTTPCodes.NOT_FOUND
    }

  } catch (e) {
    logger.error(e)
    ctx.status = e.status ? e.status : HTTPCodes.UNPROCESSABLE_ENTITY
    ctx.body = e
  }
  await next()
})

router.post('/:groupId', RequireAuth, async (ctx: MyContext<any, any>, next) => {
  try {
    const groupId = ctx.params.groupId
    const userId = ctx.state.user.id as string
    if (!groupId) {
      ctx.status = HTTPCodes.BAD_REQUEST
      ctx.body = {
        data: null,
        error: "must include a group id",
        success: false
      }
    }
    if (groupId && userId) {
      ctx.body = await rollService.roll(groupId, userId)
      ctx.status = HTTPCodes.OK
    }
  } catch (e) {
    logger.error(e)
    ctx.status = e.status ? e.status : HTTPCodes.UNPROCESSABLE_ENTITY
    ctx.body = e
  }
  await next()

})

router.get('/inCount', RequireAuth, async (ctx: MyContext<IPlayerInCountRequestBody, any>, next) => {
  const requestBody = ctx.request.body
  const res = rollUtilities.inCount(requestBody.players)
  ctx.body = {
    data: res,
    error: null,
    success: false
  }
  await next()
})

router.post('start', RequireAuth, async (ctx: MyContext<RollStartRequest, RollStartResponse>, next) => {
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


