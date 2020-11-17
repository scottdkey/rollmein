import { DefaultContext, ParameterizedContext } from "koa";
import { query } from "..";
import { playerInterface, playerTable, Player } from "../models/player"

const getAllPlayers = async (ctx: DefaultContext) => {
  const { uuid } = ctx.params
  await query(`SELECT * FROM ${playerTable} where user_id=$1`, [uuid])
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
const getSinglePlayer = async (ctx: DefaultContext) => {
  const { id } = ctx.params
  await query(`SELECT * FROM ${playerTable} WHERE id=$1`, [id]).then(res => {
    const player: playerInterface = res.rows[0]
    ctx.status = 200;
    ctx.body = player
  }).catch((err: Error) => {
    ctx.throw(404, "That query didn't return a player");
    ctx.error = err
  })
  return ctx
}
const addPlayer = async (ctx: ParameterizedContext) => {
  const p: playerInterface = ctx.request.body
  const values = [p.player_name, p.tank, p.dps, p.healer, p.locked, p.in_the_roll, p.user_id]
  await query(`INSERT INTO ${playerTable} (player_name, tank, dps, healer, locked, in_the_roll, user_id) RETURNING *`, values)
    .then(res => {
      const player: playerInterface = res.rows[0]
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
  const values = [p.player_name, p.tank, p.dps, p.healer, p.locked, p.in_the_roll, p.id]
  const text = `UPDATE ${playerTable} SET player_name = $1, tank = $2, dps = $3, healer = $4, locked = $5, in_the_roll = $6 WHERE id=$7`
  await query(text, [values])
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
  const text = `DELETE FROM ${playerTable} WHERE id = $1`
  const values = [id]
  await query(text, [values]).then(res => {
    ctx.throw(200, res);
    ctx.body = `Player ${ctx.params.id} has been deleted.`
  }
  ).catch((err: Error) => {
    ctx.throw(408, "An error has occured while deleting this item");
    ctx.error = err
  })
  return ctx
}

export { getAllPlayers, getSinglePlayer, addPlayer, updatePlayer, deletePlayer }

