import * as dotenv from "dotenv";
const config = dotenv.config().parsed

const keys = config!
console.log(keys)

export default keys