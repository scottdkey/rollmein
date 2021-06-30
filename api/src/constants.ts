import dotenv from "dotenv"
dotenv.config()


const { NODE_ENV, PORT, secretKey, REDIS_HOST, PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env
export const __prod__ = NODE_ENV === 'production'
export const COOKIE_NAME = 'qid'
export const FORGET_PASSWORD_PREFIX = 'forget-password:'
export const __port__: number = PORT ? parseInt(PORT) : 5000
export const SECRET_KEY = secretKey ? secretKey : "developmentKey";
export const REDIS = REDIS_HOST ? REDIS_HOST : "localhost"
export const DATABASE_NAME = PGDATABASE ? PGDATABASE : "rollmein_dev"

export const PG_USER = PGUSER ? PGUSER : 'postgres'
export const PG_PASS = PGPASSWORD ? PGPASSWORD : 'postgres'
export const PG_HOST = PGHOST ? PGHOST : 'localhost'
export const PG_PORT = PGPORT ? parseInt(PGPORT) : 5432

export const __uri__ = "http://localhost:3000"