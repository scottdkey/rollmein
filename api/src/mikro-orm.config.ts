import { __dbName__, __pgHost__, __pgPass__, __pgPort__, __pgUser__, __prod__, __test__ } from "./constants"

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
    transactional: true,
  },
  entities: [Options, User, Player],
  dbName: __dbName__,
  user: __pgUser__,
  password: __pgPass__,
  host: __pgHost__,
  port: __pgPort__,
  type: "postgresql",
  debug: !__prod__ || !__test__
} as Parameters<typeof MikroORM.init>[0];