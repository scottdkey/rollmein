import Router from "koa-router";
import Players from "../db/controllers/Players";
import { playerTable } from "../db/models/player";
import { DefaultContext, ParameterizedContext } from "koa";

const router = new Router();

//current route is /api/v1/players
router.prefix(`/api/v1/${playerTable}`)

router.get(`/:uuid`, async (ctx: ParameterizedContext) =>
  await Players.getAllPlayers(ctx.params.uuid).then(res => {
    ctx.status = 200;
    ctx.body = res
  }).catch((err: Error) => {
    ctx.status = 404;
    ctx.body = err || "Error, no players found."
  }));

router.get(`/`, async (ctx: ParameterizedContext) =>
  await Players.getSinglePlayer(ctx.request.body).then(res => {
    ctx.status = 200;
    ctx.body = res
  }).catch((err: Error) => {
    ctx.error = err
    ctx.throw(404, "That query didn't return a player");

  }))

router.post(`/`, async (ctx: ParameterizedContext) =>
  await Players.addPlayer(ctx.request.body).then((res) => {
    ctx.status = 201;
    ctx.body = res
  })
    .catch((err: Error) => {
      ctx.error = err
      ctx.throw(404, "Unable to create new Player");

    })
);

router.put(`/`, async (ctx: ParameterizedContext) =>
  await Players.updatePlayer(ctx.request.body).then((res) => {
    ctx.status = 200;
    ctx.body = res
  })
    .catch((err: Error) => {
      ctx.body = err
      ctx.throw(403, `Error occurred while updating: ${ctx.request.body.name}`);

    }))

router.patch(`/`, async (ctx: ParameterizedContext) =>
  await Players.updatePlayer(ctx.request.body).then((res) => {
    ctx.status = 200;
    ctx.body = res
  })
    .catch((err: Error) => {
      ctx.body = err
      ctx.throw(403, `Error occurred while updating: ${ctx.request.body.name}`);

    }))

router.delete(`/`, async (ctx: DefaultContext) => {
  await Players.deletePlayer(ctx.request.body.id).then((res) => {
    ctx.status = 202
    ctx.body = res
  }
  ).catch((err: Error) => {
    ctx.status = 404
    ctx.error = err
  })
}
);

export default router;
