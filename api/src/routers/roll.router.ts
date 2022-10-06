import {RollService} from '../services/roll.service';
import {container} from '../container';
import Router from "koa-router";
import {isAuth} from '../middleware/isAuth';
import {MyContext} from "../types/context";

interface IPlayerInCountRequest {
  data: Player[]
}

const router = new Router({ prefix: '/roll' })

const rollService = container.get(RollService)

router.get('/inCount', isAuth, async (ctx: MyContext<number>, next) => {
  const requestBody: IPlayerInCountRequest = ctx.request.body
  const res = rollService.inCount(requestBody.data)
  ctx.body = {
    data: res,
    error: null,
    success: false
  }
  await next()
})


export default router

