import { DefaultState, Next } from "koa";
import Router from "koa-router";
import { LoggerService } from "../common/logger.service";
import { container } from "../container";
import { GroupService } from "./group.service";
import { RequireAuth } from "../middleware/requireAuth.middleware";
import { PlayerService } from "../player/player.service";
import { MyContext } from "../types/Context";
import { HTTPCodes } from "../types/HttpCodes.enum";



const groupRouter = new Router<DefaultState, MyContext<any, any>>({ prefix: "/group" })
const groupService = container.get(GroupService)
const playerService = container.get(PlayerService)
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
      console.error(groups.error)
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

groupRouter.get('/:groupId', async (ctx: MyContext<{}, IGroup | IApplicationError>, next: Next) => {
  const userId = ctx.state.user?.id

  const groupId = ctx.params.groupId

  if (groupId !== "undefined") {
    let response: { auth: boolean, data: DataResponse<IGroup> } = await groupService.getGroup(groupId, userId)
    if (response.data.data) {
      ctx.body = response.data.data
      ctx.status = HTTPCodes.OK
    }
    if (response.data.error) {
      ctx.body = response.data.error
      ctx.status = HTTPCodes.BAD_REQUEST
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
  next()
})

groupRouter.put("/", async (ctx: MyContext<IGroupUpdate, IGroup | IApplicationError>, next: Next) => {
  const handle = ctx.state.user?.id
  if (handle && ctx.state.validUser) {
    const res = await groupService.updateGroup(handle, ctx.request.body)
    if (res.data) {
      ctx.body = res.data
    }
    if (res.error) {
      ctx.status = 400
      ctx.body = res.error
    }
  }


  next()
})

groupRouter.delete('/', async (ctx: MyContext<{}, {}>, next: Next) => {
  console.log(ctx.request.body)

  ctx.body = {
    message: 'received'
  }

  next()
})

groupRouter.post('/addPlayer', RequireAuth, async (ctx: MyContext<ICreatePlayer, IPlayer | { message: string }>, next: Next) => {
  const body = ctx.request.body
  const groupId = body.groupId
  if (groupId !== "") {

    console.log(body)
    ctx.body = { message: "test" }
    ctx.status = HTTPCodes.OK

  }

  if (groupId === "") {
    ctx.status = HTTPCodes.UNPROCESSABLE_ENTITY
    ctx.body = {
      message: 'groupId missing from request'
    }
  }

  next()


})

groupRouter.post('/addUser', RequireAuth, async (ctx: MyContext<{ userId: string }, IPlayer | { message: string }>, _: Next) => {
  try {
    const userId = ctx.request.body.userId
    console.log({
      userId
    })
    if (userId !== "") {
      const userPlayer = await playerService.getPlayerByUserId(userId)

      console.log({
        userPlayer
      })
      ctx.body = { message: "test" }
      ctx.status = HTTPCodes.OK

    }

    if (userId === "") {
      ctx.status = HTTPCodes.UNPROCESSABLE_ENTITY
      ctx.body = {
        message: 'groupId missing from request'
      }
    }
  } catch(e){
    ctx.status = HTTPCodes.SERVER_ERROR
    ctx.body = {
      message: "server error",
      error: e.message,
      stacktrace: e.stacktrace
    }
  }

})


export default groupRouter