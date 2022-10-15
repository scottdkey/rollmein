import { ValidateAuthMiddleware } from './../middleware/validateAuth.middleware';
import Router from 'koa-router'
import { container } from '../container';
import { ConfigService } from '../services/config.service';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { } from 'cookies';

const serverConfig = container.get(ConfigService).ServerConfig()
const authRouter = new Router({ prefix: '/auth' })

authRouter.post("/validate", ValidateAuthMiddleware, async (ctx, next) => {
  ctx.body = {
    message: "works"
  }
  ctx.status = 200
  await next()
})

authRouter.get('/hello', async (ctx, next) => {
  ctx.body = 'bye'
  await next()
})

export default authRouter