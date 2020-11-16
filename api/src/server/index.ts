import Koa from "koa";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import passport from "koa-passport";
import redisStore from "koa-redis";

import keys from "../config/keys"
import playerRoutes from "../routes/players.js";
import userRoutes from "../routes/users.js";
import authRoutes from "../routes/auth.js";
import indexRoutes from "../routes/index"
import { connect, sequelize } from "../db"

const PORT: number = parseInt(keys.PORT) || 1337;
const app = new Koa();

//database
connect()
app.context.db = sequelize


//sessions
app.keys = [keys!.SECRETKEY];
app.use(session({ store: redisStore({}) }, app));

//body parser
app.use(bodyParser({}));

//authentication
import "./auth";
app.use(passport.initialize());
app.use(passport.session());

//routes

// app.use(serve(StaticSiteBuild));
app.use(indexRoutes.routes())
app.use(playerRoutes.routes());
app.use(userRoutes.routes());
app.use(authRoutes.routes())

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default server;
