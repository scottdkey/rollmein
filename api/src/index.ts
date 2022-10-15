import 'reflect-metadata';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import { container } from "./container";
import { Routers } from "./routers";
import { ConfigService } from "./services/config.service";
import { LoggerService } from "./services/logger.service";


const app = new Koa();
const config = container.get(ConfigService).ServerConfig()
const logger = container.get(LoggerService).getLogger('IndexLogger')


app.use(bodyParser())
app.use(
  cors({
    origin: config.cors_uri,
    credentials: true,
    headers: ['Set-Cookie, Authorization']
  })
)

Routers.forEach(({ router, routerName }) => {
  logger.info(`starting ${routerName}`)
  app.use(router.routes()).use(router.allowedMethods())

})

export const server = app.listen(config.port, () => {
  const message = `server started on http://localhost:${config.port}`
  !config.test || config.prod ? logger.info(message) : null
});
