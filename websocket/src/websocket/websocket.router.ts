import Router from "koa-router";

export const groupWsRouter = new Router({
  prefix: "/groupws",
});

groupWsRouter.all("/");

export default groupWsRouter;
