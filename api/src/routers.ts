import indexRouter from "./index/index.router.js";
import userOptionsRouter from "./userOptions/userOptions.router.js";
import rollRouter from "./roll/roll.router.js";
import playerRouter from "./player/player.router.js";
import userRouter from "./user/user.router.js";
import Router from "koa-router";
import authRouter from "./auth/auth.router.js";
import groupRouter from "./group/group.router.js";
import { container } from "./container.js";
import { LoggerService } from "./logger/logger.service.js";

const Routers: { router: Router; routerName: string }[] = [
  { router: indexRouter, routerName: "indexRouter" },
  { router: userRouter, routerName: "userRouter" },
  { router: groupRouter, routerName: "groupRouter" },
  { router: userOptionsRouter, routerName: "userOptionsRouter" },
  { router: rollRouter, routerName: "rollRouter" },
  { router: playerRouter, routerName: "playerRouter" },
  { router: authRouter, routerName: "authRouter" },
];

const logger = container.get(LoggerService).getLogger("Routers");

export const RegisterRouters = (app: any) => {
  Routers.forEach(({ router, routerName }) => {
    logger.trace(`${routerName} added`);
    app.use(router.routes()).use(router.allowedMethods());
  });
};
