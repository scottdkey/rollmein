import { PlayerFormObject, PlayerObject } from "./Interfaces"

import axios from "axios"
import env from "../../config"


const BASE_URL = `${env.API_URL}/players`

const PlayerUpdate = async (updatedPlayer: PlayerObject, players: Array<PlayerObject>) => {
  let updatedPlayers: Array<PlayerObject> | undefined
  const res = await axios.put(`${BASE_URL}/${updatedPlayer.id}`, updatedPlayer)
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

const NewPlayer = async (newPlayer: PlayerFormObject, players: Array<PlayerObject>, id: number) => {
  const res = await axios.post(`${BASE_URL}/${id}`, newPlayer)
  const newPlayers: Array<PlayerObject> = [...players, res.data];
  return newPlayers
}
const DeletePlayer = async (id: number, players: Array<PlayerObject>) => {

  const res = await axios.delete(`/api/players/${id}`)
  let newPlayers: Array<PlayerObject> | undefined = players.filter(
    (player: PlayerObject) => player.id !== res.data[0].id
  );

  return (newPlayers)
}

const GetPlayers = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  let playerResponse: Array<PlayerObject> = res.data.map((player: PlayerObject) => {
    return player;
  });
  return playerResponse
}

export { GetPlayers, DeletePlayer, NewPlayer, PlayerUpdate }