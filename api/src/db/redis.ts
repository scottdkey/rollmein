import Application from "koa";
import Session from "koa-session";
import RedisStore from "koa-redis";
import Redis from "ioredis"
import { COOKIE_NAME, REDIS, __prod__ } from "../constants";


export const redis = new Redis({ host: REDIS })

export const session = (app: Application) => Session({
  key: COOKIE_NAME,
  store: RedisStore({ client: redis, disable_resubscribing: true }),
  maxAge: 1000 * 60 * 60 * 24 * 3, //three day cookie, 
  httpOnly: true,
  sameSite: 'lax',
  secure: __prod__
}, app)