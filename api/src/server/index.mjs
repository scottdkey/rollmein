import Koa from "koa";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import passport from "koa-passport";
import RedisStore from "koa-redis";
import dotenv from "dotenv";

dotenv.config();

import indexRoutes from "../routes/index.mjs";
import playerRoutes from "../routes/players.mjs";
import userRoutes from "../routes/users.mjs";
import authRoutes from "../routes/auth.mjs";

const PORT = process.env.PORT || 1337;
const app = new Koa();

//sessions
app.keys = [process.env.SECRETKEY];
app.use(session({ store: new RedisStore() }, app));

//body parser
app.use(bodyParser());

//authentication
import "./auth.mjs";
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(indexRoutes.routes());
app.use(playerRoutes.routes());
app.use(userRoutes.routes());
app.use(authRoutes.routes());

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default server;
