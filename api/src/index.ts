import 'reflect-metadata'
import koaGraphql from "koa-graphql"
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { SECRET_KEY, __dbUri__, __PORT__ } from "./constants"
import session from "koa-session";
import redisStore from "koa-redis";

import { COOKIE_NAME, REDIS, __prod__ } from "./constants";
import { HelloResolver } from './resolvers/hello';
import { buildSchema } from 'type-graphql';
import Router from 'koa-router';
import { cors } from './cors';
import { createConnection } from 'typeorm';
import { User } from './entites/User';
import { UserOptions } from './entites/UserOptions';
import { Player } from './entites/player';



const main = async () => {
  
  await createConnection({
    type: 'postgres',
    url: __dbUri__,
    logging: !__prod__,
    synchronize: true,
    entities: [User, UserOptions, Player]
  })
  const app: Koa = new Koa()

  app.keys = [SECRET_KEY]
  const router = new Router();
  app.use(bodyParser({}))
  app.use(session({
    prefix: COOKIE_NAME,
    store: redisStore({
      host: REDIS
    }),
    maxAge: 1000 * 60 * 60 * 24 * 3, //3 day cookie
    httpOnly: true,
    secure: __prod__,
    sameSite: 'lax',
  }, app))
  app.use(cors)
  router.all('/graphql', koaGraphql({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false
    }),
    graphiql: true
  }))
  app.use(router.routes())
  // app.use(router.allowedMethods())
  app.listen(__PORT__, () => {
    console.log(`Server listening on ${__PORT__}/graphql`)
  })

}

export default main().catch(err => {
  console.error(err)
})