import indexRouter from "./index.router"
import userOptionsRouter from "./userOptions.router"
import rollRouter from "./roll.router"
import playerRouter from "./player.router"
import userRouter from "./user.router"
import Router from "koa-router";

export const Routers: Router[] = [
  indexRouter,
  userRouter,
  userOptionsRouter,
  rollRouter,
  playerRouter
]