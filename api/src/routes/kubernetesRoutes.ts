import Router from "@koa/router"
import { serverOn } from ".."


const router = new Router()



router.get('/live', async (ctx, next) => {
  if (serverOn) {
    ctx.body = {
      message: "Currently Running"
    }
    ctx.status = 200
  } else {
    ctx.body = {
      message: "waiting"
    }
    ctx.status = 500
  }

  next()
})

router.get('/health', async (ctx, next) => {
  if (serverOn) {
    ctx.body = {
      message: "Currently Healthy"
    }
    ctx.status = 200
  } else {
    ctx.body = {
      message: "Bad Health"
    }
    ctx.status = 500
  }
  next()
})

export { router as kubeRouter }