import indexRouter from "./index/index.router.js";
import * as Router from "koa-router";

export const Routers: { router: Router; routerName: string }[] = [
  { router: indexRouter, routerName: "indexRouter" },
];
