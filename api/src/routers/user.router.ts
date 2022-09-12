import { UserService } from '../services/user.service';
import { container } from './../container';
import Router from 'koa-router'
import { User } from '../types/user';
import { HandleDataResponse } from '../context';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { isAuth } from '../middleware/isAuth';
import {MyContext} from "../types/context";

const router = new Router({ prefix: '/user' })
const userService = container.get(UserService)
export type UserContext = MyContext<User>

router.get('/me', isAuth, async (ctx: UserContext, next) => {
  if (ctx.state.user) {
    const res = await userService.getUserById(ctx.state.user.id)
    const {body, status} = HandleDataResponse(res, HTTPCodes.OK)
    ctx.body = body
    ctx.status = status
  }
  await next()
})




export default router