import { config } from "dotenv"

config()

const { NODE_ENV, PORT, secretkey, FE_ORIGIN, REDIS_HOST } = process.env


export const __prod__ = NODE_ENV === 'production'
export const COOKIE_NAME = 'qid'
export const FORGET_PASSWORD_PREFIX = 'forget-password:'
export const __PORT__: String = PORT ? PORT : "4000"
export const SECRET_KEY: string = __prod__ ? secretkey! : "developmentKey";

export const __uri__: string = FE_ORIGIN ? FE_ORIGIN : "http://localhost:3000"

export const REDIS = REDIS_HOST ? REDIS_HOST : "http://localhost:6379"

const { PGPORT, PGPASSWORD, PGUSER, PGDATABASE, PGHOST } = process.env

export const __dbUri__: string = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`