import Router from "koa-router";
import Players from "../db/controllers/Players";
import { playerTable } from "../db/models/player";
import { DefaultContext, ParameterizedContext } from "koa";
import { checkAuthStatus } from "../db/controllers/Auth";

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

router.get(`/getOne/:id`, async (ctx: ParameterizedContext) => {
  const { id } = ctx.params
  console.log(id)
  await Players.getSinglePlayer(id).then(res => {
    ctx.status = 200;
    ctx.body = res
  }).catch((err: Error) => {
    ctx.error = err
    ctx.throw(404, "That query didn't return a player");

  })
})

router.post(`/`, async (ctx: ParameterizedContext) => {
  console.log(ctx.request.body)
  await Players.addPlayer(ctx.request.body).then((res) => {
    ctx.status = 201;
    ctx.body = res
  })
    .catch((err: Error) => {
      ctx.error = err
      ctx.throw(404, "Unable to create new Player");

    })
}
);

router.put(`/`, async (ctx: ParameterizedContext) => {

  await Players.updatePlayer(ctx.request.body).then((res) => {
    ctx.status = 200;
    ctx.body = res
  })
    .catch((err: Error) => {
      ctx.body = err
      ctx.throw(403, `Error occurred while updating: ${ctx.request.body.name}`);

    })
})

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
  const { id } = ctx.request.body
  const authStatus = await checkAuthStatus(ctx)
  const player = await Players.getSinglePlayer(id)
  const verifyOwnership = authStatus.id === player.userId
  if (!authStatus.verified) {
    ctx.status = 401
    ctx.error = "You are not authorized to preform that action"
  } else if (!verifyOwnership){
    ctx.status = 401
    ctx.error = "You don't own that. You can't delete it."
  }else {
    await Players.deletePlayer(id).then((res) => {
      ctx.status = 202
      ctx.body = res
    }
    ).catch((err: Error) => {
      ctx.status = 404
      ctx.error = err
    })
  }
}

);

export default router;
