import Router from 'koa-router'


const indexRouter = new Router()

indexRouter.get("/", async (ctx, next) => {
  ctx.body = {
    message: 'test'
  }
  await next()
})

indexRouter.get('/hello', async (ctx, next) => {
  ctx.body = 'bye'
  await next()
})

export default indexRouter