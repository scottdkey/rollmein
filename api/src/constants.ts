import dotenv from "dotenv"
dotenv.config()

const { REDIS_HOST, PGDB, PGUSER, PGPASS, PGHOST, PGPORT, SECRETKEY, PORT, CORS_URL } = process.env

export const __prod__: boolean = process.env.NODE_ENV === 'production'
export const __uri__: string = CORS_URL ? CORS_URL : "http://localhost:3000"
export const __port__: number = PORT ? parseInt(PORT) : 5000
export const __secretKey__: string = SECRETKEY ? SECRETKEY : "developmentKey";
export const __cookieName__: string = 'qid'
export const __forgetPasswordPrefix__: string = 'forget-password:'
export const __redisHost__: string = REDIS_HOST ? REDIS_HOST : "localhost"


export const __pgHost__ = PGHOST ? PGHOST : '0.0.0.0'
export const __dbName__: string = PGDB ? PGDB : "rollmein_dev"
export const __pgPort__ = PGPORT ? parseInt(PGPORT) : 5432
export const __pgUser__ = PGUSER ? PGUSER : 'postgres'
export const __pgPass__ = PGPASS ? PGPASS : 'postgres'


