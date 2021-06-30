import Router from "koa-router";
import Players from "../db/controllers/Players";
import { DefaultContext, ParameterizedContext } from "koa";

const router = new Router();

//current route is /api/v1/players
router.prefix(`/players`)

router.get(`/:uuid`, async (ctx: ParameterizedContext) => {
  console.log(ctx.params.uuid)
});

router.get(`/getOne/:id`, async (ctx: ParameterizedContext) => {
  const { id } = ctx.params
  console.log(id)
})

router.post(`/`, async (ctx: ParameterizedContext) => {
  //add player
  console.log(ctx.request.body)
}
);

router.put(`/`, async (ctx: ParameterizedContext) => {
  // update player
  console.log(ctx.request.body)
})

router.patch(`/`, async (ctx: ParameterizedContext) =>
  // update player
  console.log(ctx.request.body))

router.delete(`/`, async (ctx: DefaultContext) => {
  const { id } = ctx.request.body
  console.log(id)
  await Players.deletePlayer(id).then((res) => {
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
