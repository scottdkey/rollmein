import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from "koa-session";
import passport from "koa-passport";
import redisStore from "koa-redis";
import dotenv from "dotenv"

import playerRoutes from "../routes/players";
import userRoutes from "../routes/users";
import authRoutes from "../routes/auth";
import indexRoutes from "../routes/index"
import userOptionsRoutes from "../routes/userOptions"
import rollRoutes from "../routes/rolls"
import db from "../db"
import './auth';

dotenv.config()
const PORT: number = parseInt(process.env.PORT!) || 1337;
const app: Koa = new Koa();

//body parser
app.use(bodyParser({}));

//database
<<<<<<< HEAD:packages/api/src/server/index.ts
db.createDatabase()
db.migration()
=======
db.createDatabase();
db.migration();
//sessions
>>>>>>> f5e0dfd7c6c96bddcd095febdd48a361ea5b5cfc:api/src/server/index.ts

//sessions
app.keys = [process.env.SECRETKEY!];
app.use(session({
  store: redisStore({
    host: process.env.REDIS_HOST
  })
}, app));

//authentication
<<<<<<< HEAD:packages/api/src/server/index.ts

=======
import "./auth";
>>>>>>> f5e0dfd7c6c96bddcd095febdd48a361ea5b5cfc:api/src/server/index.ts
app.use(passport.initialize());
app.use(passport.session());

//routes

// app.use(serve(StaticSiteBuild));
app.use(indexRoutes.routes())
app.use(userRoutes.routes());
app.use(playerRoutes.routes());
app.use(userOptionsRoutes.routes())
app.use(rollRoutes.routes())
app.use(authRoutes.routes())



// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default server;
