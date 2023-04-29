import { DefaultState, Next } from "koa";
import Router from "koa-router";

import { container } from "../container";
import { GroupService } from "./group.service";

import { RequireAuth } from "../common/middleware/requireAuth.middleware";
import { LoggerService } from "../logger/logger.service";
import { MyContext } from "../types/Context";
import { ICreateGroup, IGroup, IGroupPlayerCountResponse, IUpdateGroup, IJoinGroupReq, IJoinGroupRes } from "../types/Group";
import { HTTPCodes } from "../types/HttpCodes.enum";
import { IApplicationError } from "../types/ApplicationError";
import { ErrorTypes } from "../types/ErrorCodes.enum";
import { ErrorMessages } from "../utils/ErrorTypes.enum";



const groupRouter = new Router<DefaultState, MyContext<any, any>>({ prefix: "/group" })
const groupService = container.get(GroupService)
const logger = container.get(LoggerService).getLogger('group router')

groupRouter.get("/", async (ctx: MyContext<{}, IGroup[] | IApplicationError>, next: Next) => {
  let returnGroups: IGroup[] = []
  let error = false
  const user = ctx.state.user
  if (user) {
    try {
      const groups = await groupService.getGroupsByUserId(user.id)
      if (groups) {
        returnGroups = [...groups]
      }

    } catch (e) {
      logger.error({ message: 'get groups error', error: e })
      error = true
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
  }
  if (!error) {
    ctx.status = HTTPCodes.OK
  }
  if (error) {
    ctx.status = HTTPCodes.NOT_FOUND
  }

  ctx.body = [...new Map(returnGroups.map((group) => [group["id"], group])).values()]

  await next()
})

groupRouter.get('/:groupId', async (ctx: MyContext<{}, {
  group: IGroup | null,
  error: IApplicationError | null
}>, next: Next) => {
  try {
    const userId = ctx.state.user?.id
    const groupId = ctx.params.groupId
    if (groupId !== "undefined") {
      const { group } = await groupService.getGroup(groupId, userId)
      if (group) {
        ctx.body = {
          group,
          error: null
        }
        ctx.status = HTTPCodes.OK
      }
    } else {
      ctx.status = HTTPCodes.NOT_FOUND
      ctx.body = {
        group: null,
        error: {
          message: ErrorMessages.GroupNotFound,
          type: ErrorTypes.NOT_FOUND,
          context: "group router get group by id",
          detail: "group id is undefined"
        }
      }
    }
  } catch (e) {
    ctx.status = e.status
    ctx.body = {
      group: null,
      error: {
        message: ErrorMessages.GroupNotFound,
        type: ErrorTypes.NOT_FOUND,
        context: "group router get group by id",
        detail: e.message
      }
    }
  }

  await next()
})

groupRouter.post("/", async (ctx: MyContext<ICreateGroup, IGroup | { message: string }>, next: Next) => {
  logger.info({ message: "post route", body: ctx.request.body })
  try {
    if (ctx.state.user && ctx.state.validUser) {
      const res = await groupService.createGroup(ctx.state.user.id, ctx.request.body)
      if (res.data && res.success) {
        ctx.body = res.data
        ctx.status = HTTPCodes.CREATED
      }
      if (res.error) {
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
  await next()
})

groupRouter.put("/", async (ctx: MyContext<IUpdateGroup, IGroup | IApplicationError>, next: Next) => {
  const userId = ctx.state.user?.id
  if (userId && ctx.state.validUser) {
    const res = await groupService.updateGroup(userId, ctx.request.body)
    if (res.data) {
      ctx.body = res.data
    }
    if (res.error) {
      ctx.status = 400
      ctx.body = res.error
    }
  }


  await next()
})

groupRouter.delete('/', async (ctx: MyContext<{}, {}>, next: Next) => {
  console.log(ctx.request.body)

  ctx.body = {
    message: 'received'
  }

  await next()
})

groupRouter.post('/addPlayer', RequireAuth, async (ctx: MyContext<ICreatePlayer, {
  player: IPlayer | null,
  error: IApplicationError | null
}>, next: Next) => {
  const body = ctx.request.body
  const groupId = body.groupId
  const userId = ctx.state.user.id
  if (groupId && userId) {
    const player = await groupService.createGroupPlayer(body, groupId, userId)
    ctx.body = {
      player,
      error: null
    }
    ctx.status = HTTPCodes.OK

  }

  if (groupId === "") {
    ctx.status = HTTPCodes.UNPROCESSABLE_ENTITY
    ctx.body = {
      player: null,
      error: {
        message: ErrorMessages.GroupNotFound,
        type: ErrorTypes.NOT_FOUND,
        context: "group router add player",
        detail: "group id is undefined"
      }
    }
  }

  await next()
})

groupRouter.post('/joinGroup', RequireAuth, async (ctx: MyContext<IJoinGroupReq, IJoinGroupRes>, next: Next) => {
  try {
    const userId = ctx.state.user.id as string
    const groupId = ctx.request.body.groupId

    const res = await groupService.userJoinGroup(groupId, userId)
    ctx.body = {
      success: res
    }
  } catch (e) {
    ctx.status = e.status
    ctx.body = { success: false }
  }

  await next()

})

groupRouter.get('/count/:groupId', async (ctx: MyContext<{}, IGroupPlayerCountResponse>, next: Next) => {
  try {
    const groupId = ctx.params.groupId
    const groupCounts = await groupService.getGroupPlayerCounts(groupId)
    if (groupCounts) {
      ctx.body = groupCounts
    }
    if (!groupCounts) {
      const playerCounts: PlayerCounts = {
        locked: 0,
        inTheRoll: 0,
        tanks: 0,
        healers: 0,
        dps: 0,
      }
      ctx.message = `group counts with groupId: ${groupId} not found`
      ctx.body = playerCounts
    }
  } catch (e) {
    logger.error(e)
    ctx.status = HTTPCodes.SERVER_ERROR
    ctx.message = e.message
  }
  await next()
})


export default groupRouter