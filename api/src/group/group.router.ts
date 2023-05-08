import { DefaultState, Next } from "koa";
import Router from "koa-router";

import { container } from "../container";
import { GroupService } from "./group.service";

import { RequireAuth } from "../common/middleware/requireAuth.middleware";
import { LoggerService } from "../logger/logger.service";
import { ErrorMessages } from "../../../shared/types/ErrorTypes.enum";
import { IApplicationError } from "../../../shared/types/ApplicationError";
import { MyContext } from "../../../shared/types/Context";
import { ErrorTypes } from "../../../shared/types/ErrorCodes.enum";
import { IGroup, ICreateGroup, IUpdateGroup, IJoinGroupReq, IJoinGroupRes, IGroupPlayerCountResponse } from "../../../shared/types/Group";
import { HTTPCodes } from "../../../shared/types/HttpCodes.enum";
import { GroupCountService } from "../groupCount/groupCount.service";
import { createError } from "../utils/CreateError";



const groupRouter = new Router<DefaultState, MyContext<any, any>>({ prefix: "/group" })
const groupService = container.get(GroupService)
const groupCountService = container.get(GroupCountService)
const logger = container.get(LoggerService).getLogger('groupRouter')

groupRouter.get("/", async (ctx: MyContext<{}, IGroup[] | IApplicationError>, next: Next) => {
  try {
    let returnGroups: IGroup[] = []
    const user = ctx.state.user
    if (user) {
      const groups = await groupService.getGroupsByUserId(user.id)
      returnGroups = groups ? [...returnGroups, ...groups] : []
    }
    const groups = await groupService.getGroups()
    returnGroups = groups ? [...returnGroups, ...groups] : []

    ctx.body = [...new Set(returnGroups)]
    ctx.status = HTTPCodes.OK
  } catch (e) {
    ctx.status = HTTPCodes.INTERNAL_SERVER_ERROR
    ctx.body = e
  }

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

groupRouter.post("/", RequireAuth, async (ctx: MyContext<ICreateGroup, IGroup | { message: string }>, next: Next) => {
  try {
    const userId = ctx.state.user?.id
    const validUser = ctx.state.validUser
    if (userId && validUser) {
      const group = await groupService.createGroup(ctx.state.user.id, ctx.request.body)
      if (group) {
        ctx.body = group
        ctx.status = HTTPCodes.CREATED
      }
      if (!group) {
        ctx.body = {
          message: "group not created"
        }
        ctx.status = HTTPCodes.UNPROCESSABLE_ENTITY
      }
    }
    if (!userId || !validUser) {
      ctx.body = {
        message: "not signed in, cannot create group"
      }
      ctx.status = HTTPCodes.UNAUTHORIZED
    }
  } catch (e) {
    ctx.body = e
    ctx.status = HTTPCodes.SERVER_ERROR
  }
  await next()
})

groupRouter.put("/", async (ctx: MyContext<IUpdateGroup, IGroup | IApplicationError>, next: Next) => {
  const userId = ctx.state.user?.id
  try {
    if (userId && ctx.state.validUser) {
      const group = await groupService.updateGroup(userId, ctx.request.body)
      if (group) {
        ctx.body = group
        ctx.status = HTTPCodes.OK
      }
      if (!group) {
        ctx.body = createError({
          message: "group not updated",
          type: ErrorTypes.GROUP_ERROR,
          context: "group router update group",
        })
        ctx.status = HTTPCodes.UNPROCESSABLE_ENTITY
      }
    }
  } catch (e) {
    logger.error(e)
    ctx.body = e
    ctx.status = HTTPCodes.SERVER_ERROR
  }


  await next()
})

groupRouter.delete('/', async (ctx: MyContext<{}, {}>, next: Next) => {
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

    await groupService.userJoinGroup(groupId, userId)
    ctx.status = HTTPCodes.OK
    ctx.body = {
      success: true
    }
  } catch (e) {
    logger.error(e)
    ctx.status = HTTPCodes.SERVER_ERROR
    ctx.body = { success: false }
  }

  await next()

})

groupRouter.get('/count/:groupId', async (ctx: MyContext<{}, IGroupPlayerCountResponse>, next: Next) => {
  try {
    const groupId = ctx.params.groupId
    const groupCounts = await groupCountService.getGroupPlayerCounts(groupId)
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