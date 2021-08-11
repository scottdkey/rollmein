import Router from "@koa/router"


const router = new Router()


router.get('/live', async (ctx, next) => {
  ctx.body = "Currently Running"
  ctx.status = 200
  next()
})

router.get('/health', async (ctx, next) => {
  ctx.body = "Currently Healthy"
  ctx.status = 200
  next()
})

export { router as kubeRouter }