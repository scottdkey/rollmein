import 'reflect-metadata';
import { ApolloServer } from "apollo-server-koa";
import cors from "koa-cors";
import { config } from "dotenv";
import Redis from 'ioredis';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import redisStore from "koa-redis";

import session from "koa-session";
import { buildSchema } from "type-graphql";
import { __cookieName__, __secretKey__, __port__, __prod__, __redisHost__, __uri__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PlayerResolver } from "./resolvers/player";
import { UserResolver } from "./resolvers/user";
import { OptionsResolver } from "./resolvers/options";
import { MyContext } from "./types";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config"
import { createDatabase } from './utils/createDatabase';
import { kubeRouter } from './routes/kubernetesRoutes';

config()
export let serverOn = false
export const redis = new Redis({
  host: __redisHost__
});
const main = async () => {
  if (!__prod__) {
    await createDatabase()
  }
  const orm = await MikroORM.init(microConfig);

  const app = new Koa();
  app.use(bodyParser())
  app.use(
    cors({
      origin: __uri__,
      credentials: true
    })
  )


  app.keys = [__secretKey__]
  app.use(
    session({
      key: __cookieName__,
      store: redisStore({
        client: redis
      }),
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: false, // behind kubernetes, not secure behind cluster control plane

    }, app)
  );

  const apolloServer = new ApolloServer({
    playground: !__prod__,
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
        ctx,
        redis,
        em: orm.em.fork()
      }
    }
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: __uri__,
      credentials: true
    },
  });
  app.use(kubeRouter.routes())

  app.listen(__port__, () => {
    const message = __prod__ ? "server started on https://rollmein.scottkey.dev/graphql" : `server started on http://localhost:${__port__}/graphql`
    console.log(message);
    serverOn = true
  });

}

export default main()