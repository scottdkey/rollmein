import dotenv from "dotenv"
dotenv.config()

const { REDIS_HOST, PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT, SECRETKEY, PORT, CORS_URL } = process.env

export const __prod__ = process.env.NODE_ENV === 'production'
export const __uri__ = CORS_URL ? CORS_URL : "http://localhost:3000"
export const COOKIE_NAME = 'qid'
export const FORGET_PASSWORD_PREFIX = 'forget-password:'
export const __port__: number = PORT ? parseInt(PORT) : 5000
export const SECRET_KEY = SECRETKEY ? SECRETKEY : "developmentKey";
export const REDIS = REDIS_HOST ? REDIS_HOST : "localhost"
export const DATABASE_NAME = PGDATABASE ? PGDATABASE : "rollmein_dev"

export const PG_USER = PGUSER ? PGUSER : 'postgres'
export const PG_PASS = PGPASSWORD ? PGPASSWORD : 'postgres'
export const PG_HOST = PGHOST ? PGHOST : 'localhost'
export const PG_PORT = PGPORT ? parseInt(PGPORT) : 5432
