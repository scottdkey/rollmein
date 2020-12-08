import Router from "koa-router";
import {
  getAllPlayers,
  getSinglePlayer,
  addPlayer,
  updatePlayer,
  deletePlayer
} from "../db/controllers/Players";
import keys from "../config/keys"
import { playerTable } from "../db/models/Player";
import { DefaultContext, ParameterizedContext } from "koa";

const router = new Router();

//current route is /api/v1/players
router.prefix(`${keys.BASE_URL}/${playerTable}`)

router.get(`/:uuid`, async (ctx: ParameterizedContext) =>
  ctx = await getAllPlayers(ctx));

router.get(`/`, async (ctx: ParameterizedContext) =>
  ctx = await getSinglePlayer(ctx));

router.post(`/`, async (ctx: ParameterizedContext) =>
  ctx = await addPlayer(ctx));

router.put(`/`, async (ctx: ParameterizedContext) =>
  ctx = await updatePlayer(ctx))

router.patch(`/`, async (ctx: ParameterizedContext) =>
  ctx = await updatePlayer(ctx))

router.delete(`/`, async (ctx: DefaultContext) =>
  ctx = await deletePlayer(ctx));

export default router;
