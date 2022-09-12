import 'reflect-metadata';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import koaJwt from "koa-jwt";
import { container } from "./container";
import {Routers} from "./routers";
import { ConfigService } from "./services/config.service";



const app = new Koa();
const config = container.get(ConfigService).ServerConfig()

app.use(bodyParser())
app.use(
  cors({
    origin: "*",
    credentials: true
  })
)
app.use(koaJwt({ secret: config.secretKey, passthrough: true }))
Routers.forEach(router => {
  app.use(router.routes())

})


export const server = app.listen(config.port, () => {
  const message = `server started on http://localhost:${config.port}`
  !config.test ? console.log(message) : null
});
