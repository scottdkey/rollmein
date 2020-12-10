import { PlayerFormObject, PlayerObject } from "../../types/Interfaces"

import axios from "axios"

const PlayerUpdate = async (updatedPlayer: PlayerObject, players: Array<PlayerObject>) => {
  let updatedPlayers: Array<PlayerObject> | undefined
  const res = await axios.put(`/api/v1/players/${updatedPlayer.id}`, updatedPlayer)
  if (res.status === 200) {
    updatedPlayers = players.map((p) => {
      if (p.id === updatedPlayer.id) {
        const player = updatedPlayer;
        return player;
      } else {
        return p;
      }
    });
  }

  return updatedPlayers
};

const NewPlayer = async (newPlayer: PlayerFormObject, players: Array<PlayerObject>, uuid: number) => {
  const res = await axios.post(`/api/v1/players/${uuid}`, newPlayer)
  const newPlayers: Array<PlayerObject> = [...players, res.data[0]];
  const returnObject = { players: newPlayers, newPlayer: res.data[0] }
  return returnObject
}

const DeletePlayer = async (uuid: number, players: Array<PlayerObject>) => {
  const res = await axios.delete(`/api/v1/players/${uuid}`)
  const newPlayers: Array<PlayerObject> | undefined = players.filter(
    (player: PlayerObject) => player.id !== res.data[0].id
  );
  return newPlayers
}

const GetPlayers = async (uuid: number) => {
  const res = await axios.get(`/api/v1/players/${uuid}`);
  let playerResponse: Array<PlayerObject> = res.data.map((player: PlayerObject) => {
    return player;
  });
  return playerResponse
}

export { GetPlayers, DeletePlayer, NewPlayer, PlayerUpdate }