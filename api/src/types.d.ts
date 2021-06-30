import { Redis } from "ioredis"
import { Request, Response } from "express"
import { Session } from "express-session"

export type MyContext = {
  req: Request & { session: ExtendedSession }
  res: Response
  redis: Redis
}

interface ExtendedSession extends Session {
  userId: string
}
