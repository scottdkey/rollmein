import indexRouter from "./index/index.router.js";
import userOptionsRouter from "./userOptions/userOptions.router.js";
import rollRouter from "./roll/roll.router.js";
import playerRouter from "./player/player.router.js";
import userRouter from "./user/user.router.js";
import Router from "koa-router";
import authRouter from "./auth/auth.router.js";
import groupRouter from "./group/group.router.js";

export const Routers: { router: Router; routerName: string }[] = [
  { router: indexRouter, routerName: "indexRouter" },
  { router: userRouter, routerName: "userRouter" },
  { router: groupRouter, routerName: "groupRouter" },
  { router: userOptionsRouter, routerName: "userOptionsRouter" },
  { router: rollRouter, routerName: "rollRouter" },
  { router: playerRouter, routerName: "playerRouter" },
  { router: authRouter, routerName: "authRouter" },
];
