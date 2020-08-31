const Router = require("koa-router");
const queries = require("../db/queries/players");

const router = new Router();
const BASE_URL = "/api/v1/players";

router.get(`${BASE_URL}/:id`, async (ctx) => {
  console.log(ctx.params);
  try {
    const players = await queries.getAllPlayers(ctx.params.id);
    ctx.body = {
      status: "success",
      data: players,
    };
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
