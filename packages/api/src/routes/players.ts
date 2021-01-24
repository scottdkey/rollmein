import Router from "koa-router";
import Players from "../db/controllers/Players";
import { playerTable } from "../db/models/player";
import { DefaultContext, ParameterizedContext } from "koa";

const router = new Router();

//current route is /api/v1/players
router.prefix(`/api/v1/${playerTable}`)

router.get(`/:uuid`, async (ctx: ParameterizedContext) =>
  ctx = await Players.getAllPlayers(ctx));

router.get(`/`, async (ctx: ParameterizedContext) =>
  ctx = await Players.getSinglePlayer(ctx));

router.post(`/`, async (ctx: ParameterizedContext) =>
  ctx = await Players.addPlayer(ctx));

router.put(`/`, async (ctx: ParameterizedContext) =>
  ctx = await Players.updatePlayer(ctx))

router.patch(`/`, async (ctx: ParameterizedContext) =>
  ctx = await Players.updatePlayer(ctx))

router.delete(`/`, async (ctx: DefaultContext) =>
  ctx = await Players.deletePlayer(ctx));

export default router;
