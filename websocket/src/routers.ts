import { container } from "./container.js";
import { indexRouter } from "./index/index.router.js";
import { LoggerService } from "./logger/logger.service.js";

const routers = [{ router: indexRouter, route: "/", name: "Index" }];
const logger = container.get(LoggerService).getLogger("Router");

export const RegisterRouters = (app: any) => {
  routers.forEach((r) => {
    logger.trace(`Registered ${r.name} router`);
    app.use(r.route, r.router);
  });
};
