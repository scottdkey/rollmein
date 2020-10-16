import Koa from "koa"
import serve from "koa-static"


const staticPages = new Koa()


staticPages.use(serve("../server/public"))

export default staticPages;
