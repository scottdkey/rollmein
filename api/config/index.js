import * as dotenv from "dotenv";
import { env } from "process";
dotenv.config();

import * as social from "./social";
import env from "./env";
import db from "./env";

export default {
  ...social,
  ...env,
  ...db,
};
