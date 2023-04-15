import indexRouter from "./index/index.router"
import userOptionsRouter from "./userOptions/userOptions.router"
import rollRouter from "./roll/roll.router"
import playerRouter from "./player/player.router"
import userRouter from "./user/user.router"
import Router from "koa-router";
import authRouter from "./auth/auth.router"
import groupRouter from "./group/group.router"

export const Routers: { router: Router, routerName: string }[] = [
  { router: indexRouter, routerName: 'indexRouter' },
  { router: userRouter as any, routerName: 'userRouter' },
  { router: groupRouter, routerName: 'groupRouter' },
  { router: userOptionsRouter, routerName: 'userOptionsRouter' },
  { router: rollRouter, routerName: 'rollRouter' },
  { router: playerRouter, routerName: 'playerRouter' },
  { router: authRouter, routerName: 'authRouter' }
]