import { createConnection } from "typeorm";
import { User } from "./entites/User";
import { Player } from "./entites/Player";
import { DATABASE_NAME, PG_HOST, PG_PASS, PG_PORT, PG_USER } from "./constants";
import { UserOptions } from "./entites/UserOptions";

export const db = async () => {
  await createConnection({
    type: 'postgres',
    database: DATABASE_NAME,
    username: PG_USER,
    password: PG_PASS,
    host: PG_HOST,
    port: PG_PORT,
    logging: true,
    synchronize: true,
    entities: [Player, User, UserOptions]
  })
}