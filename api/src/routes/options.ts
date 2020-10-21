import Router from "koa-router";
import queries from "../db/queries/options"
import keys from "../config"


const router = new Router();
const BASE_URL = `${keys.BASE_URL}/options`


router.get(`${BASE_URL}/:uid/:id`, async (ctx) => {
  const options = await queries.getOptions(ctx.params.uid, ctx.params.id)
  if (options.length) {
    ctx.body = options
  } else {
    ctx.status = 404;
    ctx.body = "An error has occurred, that options object was not found"
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const options = await queries.updateUserOptions(ctx.params.id, ctx.request.body)
    if (options) {
      ctx.status = 200;
      ctx.body = options
    } else {
      ctx.status = 406;
      ctx.body = "An error has occured. That Options object was not updated"
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = err.message || "Sorry, a generic error has occurred"
  }
})

export default router;