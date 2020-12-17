import db from "../index";
import Player, { newPlayerInterface, playerInterface, playerTable } from "../models/player"

const getAllPlayers = async (uuid: string): Promise<Array<Player>> => {
  const { rows } = await db.query(`SELECT * FROM ${playerTable} where user_id=$1;`, [uuid])
  const players = rows.map(row => {
    return new Player(row)
  })
  return players
}
const getSinglePlayer = async (id: number): Promise<Player> => {
  const { rows } = await db.query(`SELECT * FROM ${playerTable} WHERE id=$1`, [id])
  const player = new Player({ ...rows[0] })
  return player
}
const addPlayer = async (p: newPlayerInterface): Promise<Player> => {
  const text = `INSERT INTO ${playerTable} (player_name, tank, dps, healer, locked, in_the_roll, user_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *;`
  const values = [p.player_name, p.tank, p.dps, p.healer, p.locked, p.in_the_roll, p.user_id]
  const { rows } = await db.query(text, values)
  const player: Player = new Player({ ...rows[0] })
  return player
}
const updatePlayer = async (playerToUpdate: playerInterface): Promise<Player> => {
  const p = new Player(playerToUpdate)
  const values = [p.id, p.player_name, p.tank, p.dps, p.healer, p.locked, p.in_the_roll]
  const text = `UPDATE ${playerTable} SET player_name = $2, tank = $3, dps = $4, healer = $5, locked = $6, in_the_roll = $7 WHERE id = $1 RETURNING *;`
  const { rows } = await db.query(text, values)
  const player: Player = new Player({ ...rows[0] })
  return player
}
const deletePlayer = async (id: number) => {
  const text = `DELETE FROM ${playerTable} WHERE id = $1;`
  const values = [id]
  await db.query(text, values)
  try {
    return id
  } catch (e) {
    return e
  }
}

export default { getAllPlayers, getSinglePlayer, addPlayer, updatePlayer, deletePlayer }

