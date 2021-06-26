import { Redis } from "ioredis"
import { ParameterizedContext } from "koa"

export type MyContext = {
  redis: Redis;
  ctx: ParameterizedContext
}

declare module "express-session" {
  interface Session {
    userId: string
  }
}