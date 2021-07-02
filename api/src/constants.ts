import dotenv from "dotenv"
dotenv.config()

<<<<<<< HEAD
export const __prod__ = process.env.NODE_ENV === 'production'
export const __uri__ = process.env.frontend_uri ? process.env.frontend_uri : "http://localhost:3000"
=======

const { NODE_ENV, PORT, secretKey, REDIS_HOST, PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env
export const __prod__ = NODE_ENV === 'production'
>>>>>>> 21dc7b5739ff55f33d3abf45990a02038899b595
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