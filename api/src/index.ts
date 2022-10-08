import 'reflect-metadata';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import koaJwt from "koa-jwt";
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
    origin: config.cors_uri || 'localhost',
    credentials: true
  })
)

app.use(koaJwt({ secret: config.secretKey, passthrough: true }))

app.use(async(ctx, next) => {
  ctx.body = ctx
  next()
})

Routers.forEach(({ router, routerName }) => {
  logger.debug(`starting ${routerName}`)
  app.use(router.routes()).use(router.allowedMethods())

})


export const server = app.listen(config.port, () => {
  const message = `server started on http://localhost:${config.port}`
  !config.test ? logger.info(message) : null
});
