import Router from "koa-router";
import queries from "../db/queries/players.js";
import keys from "../../config"

const router = new Router();

const BASE_URL = `${keys.BASE_URL}/players`

router.get(`${BASE_URL}/:uid`, async (ctx) => {
  const players = await queries.getAllPlayers(ctx.params.uid);
  ctx.body = players
});

router.get(`${BASE_URL}/:uid/:id`, async (ctx) => {
  try {
    const player = await queries.getSinglePlayer(ctx.params.uid, ctx.params.id);
    if (player.length) {
      ctx.body = player
    } else {
      ctx.status = 404;
      ctx.body = { error: { error: true, message: "That player was not found." } };
    }
  } catch (err) {
    console.log(err);
  }
});

router.post(`${BASE_URL}/:uid`, async (ctx) => {
  const newPlayer = { ...ctx.request.body, user_id: ctx.params.uid };
  try {
    const player = await queries.addPlayer(newPlayer);
    if (player.length) {
      ctx.status = 201;
      ctx.body = player
    } else {
      ctx.status = 400;
      ctx.body = "Something went wrong"
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = err.message || "Sorry, an error has occurred."
  }
});

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const player = await queries.updatePlayer(ctx.params.id, ctx.request.body);
    if (player.length) {
      ctx.status = 200;
      ctx.body = player
    } else {
      ctx.status = 404;
      ctx.body = "That player either doesn't exist or was not found."
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = err.message || "Sorry, an error has occurred"
  }
});

router.patch(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const player = await queries.updatePlayer(ctx.params.id, ctx.request.body);
    if (player.length) {
      ctx.status = 200;
      ctx.body = player
    } else {
      ctx.status = 404;
      ctx.body = "That player either doesn't exist or was not found."
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = err.message || "Sorry, an error has occurred"
  }
});

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const player = await queries.deletePlayer(ctx.params.id);
    if (player.length) {
      ctx.status = 200;
      ctx.body = player
    } else {
      ctx.status = 404;
      ctx.body = "That player does not exist."
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = err.message || "Sorry, an error has occurred."
  }
});
export default router;
