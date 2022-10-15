import { ValidateAuthMiddleware } from './../middleware/validateAuth.middleware';
import Router from 'koa-router'

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