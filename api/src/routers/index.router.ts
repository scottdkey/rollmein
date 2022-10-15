import Router from 'koa-router'


const indexRouter = new Router()

indexRouter.get("/", async (ctx, next) => {
  ctx.body = 'index'
  await next()
})

indexRouter.get('/hello', async (ctx, next) => {
  ctx.body = 'bye'
  await next()
})

export default indexRouter