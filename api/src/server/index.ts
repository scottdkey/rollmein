import Koa from "koa";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import passport from "koa-passport";
import redisStore from "koa-redis";

import keys from "../config/keys"
import playerRoutes from "../routes/players";
import userRoutes from "../routes/users";
import authRoutes from "../routes/auth";
import indexRoutes from "../routes/index"
import userOptionsRoutes from "../routes/userOptions"
import * as db from "../db"

const PORT: number = parseInt(keys.PORT) || 1337;
const app: Koa = new Koa();



//body parser
app.use(bodyParser({}));
//database
db.connect()
//sessions
console.log(process.env.REDIS_HOST)
app.keys = [process.env.SECRETKEY!];
app.use(session({
  store: redisStore({
    host: process.env.REDIS_HOST
  })
}, app));

//authentication
import "./auth";
app.use(passport.initialize());
app.use(passport.session());

//routes

// app.use(serve(StaticSiteBuild));
app.use(indexRoutes.routes())
app.use(userRoutes.routes());
app.use(playerRoutes.routes());
app.use(userOptionsRoutes.routes())
app.use(authRoutes.routes())



// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default server;
