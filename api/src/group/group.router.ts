import Router from "koa-router";
import { container } from "../container";
import { isAuth } from "../middleware/isAuth";
import { RollType } from "../roll/roll.service";
import { MyContext } from "../types/context";
import { Group, IGroupUpdateParams } from "../types/group";
import { HTTPCodes } from "../types/HttpCodes.enum";
import { GroupService } from "./group.service";



const groupRouter = new Router({ prefix: "/group" })

const groupService = container.get(GroupService)



groupRouter.get("/", isAuth, async (ctx: MyContext<{}, Group[] | AppError>, next) => {
  try {
    const groups = ctx.state.user && await groupService.getGroups(ctx.state.user.id)
    if (groups && groups.data) {
      ctx.body = groups.data
      ctx.status = HTTPCodes.OK
    }

    if (groups && groups.error) {
      ctx.body = []
      ctx.status = HTTPCodes.OK
    }

  } catch (e) {
    ctx.status = HTTPCodes.NOT_FOUND
    ctx.body = []
  }

  await next()
})

groupRouter.post("/", isAuth, async (ctx: MyContext<IGroupUpdateParams, Group>) => {

})



export default groupRouter