import { HTTPCodes } from '../types/HttpCodes.enum';
import { container } from '../container';
import Router from "koa-router";
import { UserOptionsService } from '../services/userOptions.service';
import { HandleDataResponse } from '../context';
import { isAuth } from '../middleware/isAuth';
import {MyContext} from "../types/context";

const optionsService = container.get(UserOptionsService)
const router = new Router({
  prefix: '/options'
})

type UserOptionsContext = MyContext<unknown, UserOptions>

router.get('/', isAuth, async (ctx: UserOptionsContext, next) => {
  if (ctx.state.user) {
    let res = await optionsService.getUserOptions(ctx.state.user.id)
    if (!res.data) {
      res = await optionsService.createOptions(ctx.state.user.id)
    }
    const {body, status} = HandleDataResponse(res, HTTPCodes.OK)
    ctx.body = body
    ctx.status = status
  }
  await next()
})

router.post('/', isAuth, async (ctx: UserOptionsContext, next) => {
  if (ctx.state.user) {
    const userId: string = ctx.state.user.id
    const params: UserOptionsInput = ctx.params
    const res = await optionsService.updateOptions(userId, params)
    const {body, status} = HandleDataResponse(res, HTTPCodes.CREATED)
    ctx.body = body
    ctx.status = status
  }
  await next()
})

export default router
