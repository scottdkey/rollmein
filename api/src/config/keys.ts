import dotenv from "dotenv"
const config = dotenv.config().parsed;

console.log(process.env.PGPORT)
const keys = config!;

export default keys
