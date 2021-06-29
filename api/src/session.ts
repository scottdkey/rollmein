import connectRedis from "connect-redis";
import Session from "express-session";
import { COOKIE_NAME, __prod__, SECRET_KEY } from "./constants";
import Redis from 'ioredis';


const RedisStore = connectRedis(Session)


export const redis = new Redis()
export const session = Session({
  name: COOKIE_NAME,
  store: new RedisStore({ client: redis, disableTouch: true }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 year cookie
    httpOnly: true,
    sameSite: 'lax', //csrf
    secure: __prod__ //cookie only works in https
  },
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false
})