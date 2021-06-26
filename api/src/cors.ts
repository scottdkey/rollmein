import Cors from "@koa/cors"
import { __uri__ } from "./constants"


export const cors = Cors({
  origin: __uri__ || "http://localhost:3000",
  credentials: true
})