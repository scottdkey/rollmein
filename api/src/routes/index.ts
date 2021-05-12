import Router from 'koa-router'

const router = new Router()

router.get('/', async (ctx) => {
  ctx.body = "This works!"
})
router.get('/test', async (ctx) => {
  ctx.body = "This test page is returning correctly"
})

export default router;
