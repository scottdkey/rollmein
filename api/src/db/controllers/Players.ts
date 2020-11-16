import { DefaultContext, ParameterizedContext } from "koa";


import { Player, PlayerInterface } from "../models/player"

const getAllPlayers = async (ctx: DefaultContext) => {
  await Player.findAll<Player>({
    where: {
      user_id: ctx.params.uid
    }
  }).then((players: Array<Player>) => {
    ctx.status = 200;
    ctx.body = players
  }).catch((err: Error) => {
    ctx.status = 404;
    ctx.body = err || "Error, no players found."
  })
  return ctx
}
const getSinglePlayer = async (ctx: DefaultContext) => {
  await Player.findOne<Player>({
    where: {
      id: ctx.params.id
    }
  }).then((res) => {
    const player: PlayerInterface = res!
    ctx.status = 200;
    ctx.body = player
  }).catch((err: Error) => {
    ctx.throw(404, "That query didn't return a player");
    ctx.error = err
  })
  return ctx
}
const addPlayer = async (ctx: ParameterizedContext) => {
  const newPlayer: PlayerInterface = { ...ctx.request.body, userId: ctx.params.uid }
  console.log(newPlayer)
  await Player
    .create<Player>(newPlayer)
    .then((player: Player) => {
      ctx.status = 201;
      ctx.body = player
    })
    .catch((err: Error) => {
      ctx.throw(424, "Unable to create new Player");
      ctx.error = err
    })
  return ctx
}
const updatePlayer = async (ctx: DefaultContext) => {
  const updatedPlayer: PlayerInterface = ctx.request.body
  await Player
    .update<Player>(updatedPlayer, { where: { id: ctx.params.id } })
    .then((res) => {
      const player: PlayerInterface = res[1][0]
      ctx.status = 200;
      ctx.body = player
    })
    .catch((err: Error) => {
      ctx.throw(403, `Error occurred while updating: ${ctx.request.body.name}`);
      ctx.body = err
    })

}
const deletePlayer = async (ctx: DefaultContext) => {
  await Player.destroy({
    where: {
      id: ctx.params.id
    }
  }).then((response) => {
    ctx.throw(200, response);
    ctx.body = `Player ${ctx.params.id} has been deleted.`
  }
  ).catch((err: Error) => {
    ctx.throw(408, "An error has occured while deleting this item");
    ctx.error = err
  })

}

export { getAllPlayers, getSinglePlayer, addPlayer, updatePlayer, deletePlayer }

