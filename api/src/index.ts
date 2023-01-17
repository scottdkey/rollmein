import 'reflect-metadata';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import { container } from "./container";
import { Routers } from "./routers";
import { ConfigService } from "./common/config.service";
import { LoggerService } from "./common/logger.service";
import { isAuth } from './middleware/isAuth';
import websocket from "koa-websocket"
import { GroupWebsocket } from "./websocket/websocket.router"

const logger = container.get(LoggerService).getLogger('IndexLogger')
const server = async () => {
  const app = websocket(new Koa());
  const config = container.get(ConfigService).serverConfig
  app.proxy = config.prod

  app.use(bodyParser())

  app.use(
    cors({
      origin: `${config.cors_uri}`,
      credentials: true,
      headers: ['Authorization', "content-type", 'Access-Control-Allow-Origin' ]
    })
  )

  app.use(isAuth)
  app.ws.use(GroupWebsocket)

  Routers.forEach(({ router, routerName }) => {
    logger.debug({ message: `starting ${routerName}` })
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
