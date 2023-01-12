import { RollService } from './roll.service';
import { container } from '../container';
import Router from "koa-router";
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/Context';
import { LoggerService } from '../common/logger.service';
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


export default router


