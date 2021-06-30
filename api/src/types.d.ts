import { Redis } from "ioredis"
import { DefaultContext } from "koa"

export type MyContext = {
  ctx: DefaultContext
}
