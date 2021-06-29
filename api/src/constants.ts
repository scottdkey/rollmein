import dotenv from "dotenv"
dotenv.config()

export const __prod__ = process.env.NODE_ENV === 'production'
export const COOKIE_NAME = 'qid'
export const FORGET_PASSWORD_PREFIX = 'forget-password:'
export const __port__: number = parseInt(process.env.PORT!) || 5000;
export const SECRET_KEY = process.env.secretkey ? process.env.secretkey : "developmentKey";
export const REDIS_HOST = process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost"
export const DATABASE_NAME = process.env.PGDATABASE ? process.env.PGDATABASE : "rollmein_dev"

export const PG_USER = process.env.PGUSER ? process.env.PGUSER : 'postgres'
export const PG_PASS = process.env.PGPASSWORD ? process.env.PGPASSWORD : 'postgres'
export const PG_HOST = process.env.PGHOST ? process.env.PGHOST : 'localhost'
export const PG_PORT = process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432
