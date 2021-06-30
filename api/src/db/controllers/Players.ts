
// import { ParameterizedContext } from "koa"
// import { getConnection } from "typeorm"
// import { Player } from "../../entites/Player"
// import { isAuth } from "./Users"

// export async function players(userId: string, limit: number, cursor?: string): Promise<Player[]> {
//   const realLimit = Math.min(50, limit)
//   const qb = getConnection().getRepository(Player).createQueryBuilder("players").orderBy('"createdAt"', "DESC").take(realLimit)
//   if (cursor) {
//     qb.where('"createdAt" <:cursor', {
//       cursor: new Date(parseInt(cursor))
//     })
//   }
//   return qb.where("userId = :id", { id: userId }).getMany()
// }

// export async function player(id: number): Promise<Player | undefined> {
//   return await Player.findOne(id)
// }
// type NewPlayer = {
//   playerName: string,
//   tank: boolean,
//   dps: boolean,
//   healer: boolean,
//   locked: boolean,
//   inTheRoll: boolean,
//   userId: String
// }

// type Error = {
//   error: string
// }

// export async function addPlayer(ctx: ParameterizedContext): Promise<Player | Error> {
//   if (isAuth(ctx)) {
//     const input = ctx.body as NewPlayer
//     const userId: string = ctx.session?.userId
//     return await Player.create({
//       ...input,
//       userId
//     }).save()

//   } else {
//     return {
//       error: "not authorized, please sign in"
//     }
//   }


// }
// interface UpdatePlayer extends NewPlayer {
//   id: number,
// }

// const updatePlayer = async (ctx: ParameterizedContext, id: number): Promise<Player> => {
//   if (isAuth(ctx)) {
//     const input = ctx.body as UpdatePlayer
//     const 
//     return await Player.update({ id }, { ...input })
//   }
//   const values = [p.id, p.playerName, p.tank, p.dps, p.healer, p.locked, p.inTheRoll]
//   const text = `UPDATE ${playerTable} SET player_name = $2, tank = $3, dps = $4, healer = $5, locked = $6, in_the_roll = $7 WHERE id = $1 RETURNING *;`
//   const { rows } = await db.query(text, values)
//   return conformToPlayerModel(rows[0])
// }
// const deletePlayer = async (id: number) => {
//   const text = `DELETE FROM ${playerTable} WHERE id = $1;`
//   const values = [id]
//   await db.query(text, values)
//   try {
//     return id
//   } catch (e) {
//     return e
//   }
// }

// export default { getAllPlayers, getSinglePlayer, addPlayer, updatePlayer, deletePlayer }

