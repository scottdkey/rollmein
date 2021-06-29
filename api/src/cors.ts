import Cors from "cors"
import { __uri__ } from "./constants"

export const cors = Cors({
  origin: __uri__,
  credentials: true,
})