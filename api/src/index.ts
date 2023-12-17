import "reflect-metadata";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import { container } from "./container.js";
import { Routers } from "./routers.js";
import { ConfigService } from "./config/config.service.js";
import { isAuth } from "./middleware/isAuth.js";
import { LoggerService } from "./logger/logger.service.js";
import helmet from "koa-helmet";
import { RequestLogger } from "./middleware/requestLogger.middleware.js";


const logger = container.get(LoggerService).getLogger("IndexLogger");
const server = async () => {
  const app = new Koa();
  app.use(helmet());
  app.use(bodyParser());
  app.use(isAuth);
  app.use(RequestLogger);

  const config = container.get(ConfigService).serverConfig;
  app.proxy = config.prod;

  app.use(
    cors({
      origin: `${config.cors_uri}`,
      credentials: true,
      headers: ["Authorization", "content-type", "Access-Control-Allow-Origin"],
    })
  );

  Routers.forEach(({ router, routerName }) => {
    logger.trace(`${routerName} Routes added`);
    app.use(router.routes()).use(router.allowedMethods());
  });

  return app.listen(config.port, () => {
    const localDomain = `http://localhost:${config.port}`;
    const serverDomain = "https://rollmein-api.scottkey.dev";
    const port = config.port;
    !config.test || config.prod
      ? logger.info(
          {
            localDomain,
            serverDomain,
            port,
          },
          "server listening"
        )
      : null;
  });
};

server().catch((e) => {
  logger.error(e, "server had a fatal error");
});
