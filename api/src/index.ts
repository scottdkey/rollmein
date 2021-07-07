import { ApolloServer } from "apollo-server-koa";
import cors from "koa-cors";
import { config } from "dotenv";
import Redis from 'ioredis';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import redisStore from "koa-redis";
import session from "koa-session";
import 'reflect-metadata';
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, SECRET_KEY, __port__, __prod__, REDIS } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PlayerResolver } from "./resolvers/player";
import { UserResolver } from "./resolvers/user";
import { OptionsResolver } from "./resolvers/options";
// import { createDatabase } from "./utils/createDatabase";
import { MyContext } from "./types";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config"

config()
export const redis = new Redis({
  host: REDIS
});
const main = async () => {
  // if (!__prod__) {
  //   await createDatabase()
  // }
  const orm = await MikroORM.init(microConfig);

  const app = new Koa();
  app.use(bodyParser())
  app.use(
    cors({
      origin: "http://localhost:3000"
    })
  );
  app.keys = [SECRET_KEY]
  app.use(
    session({
      key: COOKIE_NAME,
      store: redisStore({
        client: redis
      }),
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: __prod__, // cookie only works in https
    }, app)
  );

  const apolloServer = new ApolloServer({
    playground: true,
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        UserResolver,
        PlayerResolver,
        OptionsResolver],
      validate: true,

    }),
    context: ({ ctx }: MyContext) => {
      return {
        ctx, redis, em: orm.em.fork()

      }
    }
  });

  apolloServer.applyMiddleware({ app, cors: false, });

  app.listen(__port__, () => {
    console.log(`server started on http://localhost:${__port__}/graphql`);
  });

}

export default main()