import { DefaultContext, ParameterizedContext } from "koa";
import { query } from "..";
import { playerInterface, playerTable, Player } from "../models/Player"

const getAllPlayers = async (ctx: ParameterizedContext) => {
  const { uuid } = ctx.params
  await query(`SELECT * FROM ${playerTable} where user_id=$1;`, [uuid])
    .then(res => {
      const players: Array<playerInterface> = res.rows
      ctx.status = 200;
      ctx.body = players
    }).catch((err: Error) => {
      ctx.status = 404;
      ctx.body = err || "Error, no players found."
    })
  return ctx
}
const getSinglePlayer = async (ctx: ParameterizedContext) => {
  const { id } = ctx.request.body
  await query(`SELECT * FROM ${playerTable} WHERE id=$1`, [id]).then(res => {
    const player: playerInterface = res.rows[0]
    ctx.status = 200;
    ctx.body = player
  }).catch((err: Error) => {
    ctx.error = err
    ctx.throw(404, "That query didn't return a player");

  })
  return ctx
}
const addPlayer = async (ctx: ParameterizedContext) => {
  const p: playerInterface = ctx.request.body
  const text = `INSERT INTO ${playerTable} (player_name, tank, dps, healer, locked, in_the_roll, user_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *;`
  const values = [p.player_name, p.tank, p.dps, p.healer, p.locked, p.in_the_roll, p.user_id]
  await query(text, values)
    .then(res => {
      const { rows } = res
      const player = new Player({ ...rows[0] })
      ctx.status = 201;
      ctx.body = player
    })
    .catch((err: Error) => {
      ctx.error = err
      ctx.throw(424, "Unable to create new Player");

    })
  return ctx
}
const updatePlayer = async (ctx: ParameterizedContext) => {
  const p = new Player(ctx.request.body)
  const values = [p.id, p.player_name, p.tank, p.dps, p.healer, p.locked, p.in_the_roll]
  const text = `UPDATE ${playerTable} SET player_name = $2, tank = $3, dps = $4, healer = $5, locked = $6, in_the_roll = $7 WHERE id = $1 RETURNING *;`
  await query(text, values)
    .then((res) => {
      const player: playerInterface = res.rows[0]
      ctx.status = 200;
      ctx.body = player
    })
    .catch((err: Error) => {
      ctx.body = err
      ctx.throw(403, `Error occurred while updating: ${ctx.request.body.name}`);

    })
  return ctx
}
const deletePlayer = async (ctx: DefaultContext) => {
  const { id } = ctx.request.body
  const text = `DELETE FROM ${playerTable} WHERE id = $1;`
  const values = [id]
  await query(text, values)
    .then(() => {
      ctx.status = 202
      ctx.body = `Player ${id} has been deleted.`
    }
    ).catch((err: Error) => {
      ctx.status = 404
      ctx.error = err
    })
  return ctx
}

export { getAllPlayers, getSinglePlayer, addPlayer, updatePlayer, deletePlayer }

