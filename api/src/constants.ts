import dotenv from "dotenv"
dotenv.config()

const { REDIS_HOST, PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT, SECRETKEY, PORT, CORS_URL } = process.env

export const __prod__: boolean = process.env.NODE_ENV === 'production'
export const __uri__: string = CORS_URL ? CORS_URL : "http://localhost:3000"
export const __port__: number = PORT ? parseInt(PORT) : 5000
export const __secretKey__: string = SECRETKEY ? SECRETKEY : "developmentKey";

export const COOKIE_NAME: string = 'qid'
export const FORGET_PASSWORD_PREFIX: string = 'forget-password:'

export const REDIS: string = REDIS_HOST ? REDIS_HOST : "localhost"
export const DATABASE_NAME: string = PGDATABASE ? PGDATABASE : "rollmein_dev"

export const PG_USER = PGUSER ? PGUSER : 'postgres'
export const PG_PASS = PGPASSWORD ? PGPASSWORD : 'postgres'
export const PG_HOST = PGHOST ? PGHOST : 'localhost'
export const PG_PORT = PGPORT ? parseInt(PGPORT) : 5432
