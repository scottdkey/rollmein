import Router from "koa-router"

import Rolls from "../db/controllers/Rolls"
import Players from "../db/controllers/Players"
import { checkAuthStatus } from "../db/controllers/Auth"
import { DefaultContext } from "koa";

const router = new Router();

router.prefix('/api/v1/rolls')

router.get('/ffa', async (ctx: DefaultContext) => {
  const res = await checkAuthStatus(ctx)
  if (res.error) {
    ctx.body = res.error
    ctx.throw(401)
  } else if (res.verified === true) {
    const players = await Players.getAllPlayers(res.id!)
    const inGroup = Rolls.createInGroup(players)
    const roll = await Rolls.FFARoll(inGroup)
    ctx.body = roll
    ctx.status = 200
  } else {
    ctx.error = "An unknown error has occurred."
    ctx.status = 404
  }
})

router.get('/rbr', async (ctx: DefaultContext) => {
  const res = await checkAuthStatus(ctx)
  if (res.error) {
    ctx.body = res.error
    ctx.throw(401)
  } else if (res.verified === true) {
    const players = await Players.getAllPlayers(res.id!)
    const inGroup = Rolls.createInGroup(players)
    const roll = await Rolls.rollByRole(inGroup)
    ctx.body = roll
    ctx.status = 200
  } else {
    ctx.error = "An unknown error has occurred."
    ctx.status = 404
  }
})

router.get('/count', async (ctx: DefaultContext) => {
  const res = await checkAuthStatus(ctx)
  if (res.error) {
    ctx.body = res.error
    ctx.throw(401)
  } else if (res.verified === true) {
    ctx.body = await Rolls.countRoles(res.id!)
    ctx.status = 200
  } else {
    ctx.error = "An unknown error has occurred."
    ctx.status = 404
  }
})

export default router