import "reflect-metadata";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import { container } from "./container.js";
import { Routers } from "./routers.js";
import websocket from "koa-websocket";
import { ConfigService } from "./config/config.service.js";
import { LoggerService } from "./logger/logger.service.js";

const logger = container.get(LoggerService).getLogger("IndexLogger");
const server = async () => {
  const app = websocket(new Koa());
  const config = container.get(ConfigService).serverConfig;
  app.proxy = config.prod;

  app.use(bodyParser());

  app.use(
    cors({
      origin: `${config.cors_uri}`,
      credentials: true,
      headers: ["Authorization", "content-type", "Access-Control-Allow-Origin"],
    })
  );

  Routers.forEach(({ router, routerName }) => {
    logger.debug(`${routerName} Routes added`);
    app.use(router.routes()).use(router.allowedMethods());
  });

  return app.listen(config.port, () => {
    const localDomain = `ws://localhost:${config.port}`;
    const serverDomain = "wss://rollmein-api.scottkey.dev";
    const message = `websocket started on ${config.port}`;
    !config.test || config.prod
      ? logger.info({ message, url: config.prod ? serverDomain : localDomain })
      : null;
  });
};

server().catch((e) => {
  logger.error(e, "server had a fatal error");
});
