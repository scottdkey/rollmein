import Router from "koa-router";
import { getAllPlayers, getSinglePlayer, addPlayer, updatePlayer, deletePlayer } from "../db/controllers/Players";
import keys from "../config"

const router = new Router();

const BASE_URL = `${keys.BASE_URL}/players`

router.get(`${BASE_URL}/:uid`, async (ctx) => await getAllPlayers(ctx));
router.get(`${BASE_URL}/:id`, async (ctx) => await getSinglePlayer(ctx));
router.post(`${BASE_URL}/:uid`, async (ctx) => await addPlayer(ctx));
router.put(`${BASE_URL}/:id`, async (ctx) => await updatePlayer(ctx))
router.patch(`${BASE_URL}/:id`, async (ctx) => await updatePlayer(ctx))
router.delete(`${BASE_URL}/:id`, async (ctx) => await deletePlayer(ctx));

export default router;
