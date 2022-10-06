import indexRouter from "./index.router"
import userOptionsRouter from "./userOptions.router"
import rollRouter from "./roll.router"
import playerRouter from "./player.router"
import userRouter from "./user.router"
import Router from "koa-router";

export const Routers: {router: Router, routerName: string}[] = [
  {router: indexRouter, routerName: 'indexRouter' },
  {router: userRouter, routerName: 'userRouter' },
  {router: userOptionsRouter, routerName: 'userOptionsRouter' },
  {router: rollRouter, routerName: 'rollRouter' },
  {router: playerRouter, routerName: 'playerRouter' },
]