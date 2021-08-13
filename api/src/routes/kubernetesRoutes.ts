import Router from "@koa/router"
import { serverOn } from ".."


const router = new Router()



router.get('/live', async (ctx, next) => {
  if (serverOn) {
    ctx.body = "Currently Running"
    ctx.status = 200
  } else {
    ctx.body = "waiting"
    ctx.status = 500
  }

  next()
})

router.get('/health', async (ctx, next) => {
  if (serverOn) {
    ctx.body = "Currently Healthy"
    ctx.status = 200
  } else {
    ctx.body = "server crash"
    ctx.status = 500
  }
  next()
})

export { router as kubeRouter }