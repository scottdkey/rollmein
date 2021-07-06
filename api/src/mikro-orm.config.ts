import { DATABASE_NAME, PG_HOST, PG_PASS, PG_PORT, PG_USER, __prod__ } from "./constants"

import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/core"
import path from "path"
import { User } from "./entites/User"
import { Player } from "./entites/Player"
import { Options } from "./entites/Options"

export default {
  metadataProvider: ReflectMetadataProvider,
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Options, User, Player],
  dbName: DATABASE_NAME,
  user: PG_USER,
  password: PG_PASS,
  host: PG_HOST,
  port: PG_PORT,
  type: "postgresql",
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];