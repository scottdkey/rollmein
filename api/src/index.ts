import "reflect-metadata";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import { container } from "./container";
import { Routers } from "./routers";
import websocket from "koa-websocket";
import { ConfigService } from "./common/config/config.service";
import { isAuth } from "./common/middleware/isAuth";
import { LoggerService } from "./logger/logger.service";

const logger = container.get(LoggerService).getLogger("IndexLogger");
const server = async () => {
  const app = websocket(new Koa());
  const config = container.get(ConfigService).serverConfig;
  app.proxy = config.prod;

  app.use(bodyParser());

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const status = err.statusCode || err.status || 500;
      const message = err.message;
      const stackTrace = err.stackTrace;
      logger.error({
        status,
        message,
        stackTrace,
      });
      // will only respond with JSON
      ctx.status = status;
      ctx.message = message;
      ctx.body = {
        message,
      };
    }
  });

  app.use(
    cors({
      origin: `${config.cors_uri}`,
      credentials: true,
      headers: ["Authorization", "content-type", "Access-Control-Allow-Origin"],
    })
  );

  app.use(isAuth);

  Routers.forEach(({ router, routerName }) => {
    logger.debug(`${routerName} Routes added`);
    app.use(router.routes()).use(router.allowedMethods());
  });

  return app.listen(config.port, () => {
    const localDomain = `http://localhost:${config.port}`;
    const serverDomain = "https://rollmein-api.scottkey.dev";
    const message = `server started on ${config.port}`;
    !config.test || config.prod
      ? logger.info({ message, url: config.prod ? serverDomain : localDomain })
      : null;
  });
};

server().catch((e) => {
  logger.error(e, "server had a fatal error");
});
