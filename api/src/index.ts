import 'reflect-metadata';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import { container } from "./container";
import { Routers } from "./routers";
import { ConfigService } from "./common/config.service";
import { LoggerService } from "./common/logger.service";
import { isAuth } from './middleware/isAuth';
import { RefreshSession } from './middleware/refreshSession.middleware';

const logger = container.get(LoggerService).getLogger('IndexLogger')
const server = async () => {
  const app = new Koa();
  const config = container.get(ConfigService).ServerConfig()

  app.use(bodyParser())
  app.use(
    cors({
      origin: `${config.cors_uri}`,
      credentials: true,
      headers: ['Authorization', "content-type"]
    })
  )

  app.use(isAuth)
  app.use(RefreshSession)

  Routers.forEach(({ router, routerName }) => {
    logger.info({ message: `starting ${routerName}` })
    app.use(router.routes()).use(router.allowedMethods())

  })



  return app.listen(config.port, () => {
    const localDomain = `http://localhost:${config.port}`
    const serverDomain = 'https://rollmein-api.scottkey.dev'
    const message = `server started on ${config.prod ? serverDomain : localDomain}`
    !config.test || config.prod ? logger.info({ message }) : null
  });
}

server().catch(e => {
  logger.error(e)
})
