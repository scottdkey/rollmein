import Router from "koa-router";
import { LoggerService } from "../common/logger.service";
import { container } from "../container";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types/context";
import { Group, ICreateGroup, IGroupUpdateParams } from "../types/group";
import { HTTPCodes } from "../types/HttpCodes.enum";
import { GroupService } from "./group.service";



const groupRouter = new Router({ prefix: "/group" })

const groupService = container.get(GroupService)
const logger = container.get(LoggerService).getLogger('GroupRouter')



groupRouter.get("/", isAuth, async (ctx: MyContext<{}, Group[] | AppError>, next) => {
  let returnGroups: Group[] = []
  let error = false
  if (ctx.state.user?.id) {
    try {
      const groups = await groupService.getGroupsByUserId(ctx.state.user.id)
      if (groups && groups.data) {
        returnGroups = [...groups.data]
      }

      if (groups && groups.error) {
        logger.error({ message: 'get groups error', error: groups.error })
      }

    } catch (e) {
      logger.error({ message: 'get groups error', error: e })
      error = true
      ctx.status = HTTPCodes.NOT_FOUND
      ctx.body = []
    }
  }
  try {
    const groups = await groupService.getGroups()
    if (groups.data) {
      returnGroups = [...returnGroups, ...groups.data]
    }
    if (groups.error) {
      logger.error({ message: "get groups error", error: groups.error })
    }
  } catch (e) {
    logger.error({ message: 'get groups error', error: e })
    error = true
    ctx.status = HTTPCodes.NOT_FOUND
    ctx.body = []
  }
  if (!error) {
    ctx.body = returnGroups
    ctx.status = HTTPCodes.OK
  }

  await next()
})

groupRouter.post("/", isAuth, async (ctx: MyContext<ICreateGroup, Group | { message: string }>) => {
  logger.info({ message: "post route", body: ctx.request.body })
  try {
    if (ctx.state.user && ctx.state.validUser) {
      const res = await groupService.createGroup(ctx.state.user.id, ctx.request.body)
      if(res.data && res.success){
        ctx.body = res.data
        ctx.status = HTTPCodes.CREATED
      }
      if(res.error){
        ctx.body = {
          message: JSON.stringify(res.error)
        }
      }

    }
    if (!ctx.state.validUser && !ctx.state.user) {
      ctx.body = {
        message: "not signed in, cannot create group"
      }
      ctx.status = HTTPCodes.UNAUTHORIZED
    }
  } catch (e) {
    ctx.body = { message: e.message }
    ctx.status = HTTPCodes.SERVER_ERROR
  }
})



export default groupRouter