import { PlayerFormObject, PlayerObject } from "../types/Interfaces"

import axios from "axios"

const PlayerUpdate = async (updatedPlayer: PlayerObject) => {
  const res = await axios.put(`api/v1/players/`, updatedPlayer)
  return res.data
}

const NewPlayer = async (newPlayer: PlayerFormObject): Promise<PlayerObject> => {
  const res = await axios.post(`/api/v1/players/`, newPlayer)
  return res.data
}

const DeletePlayer = async (id: number) => {
  const payload = { data: { id } }
  const res = await axios.delete(`api/v1/players/`, payload)
  return res.data
}

const GetPlayers = async (uuid: string) => {
  const res = await axios.get(`api/v1/players/${uuid}`);
  let playerResponse: Array<PlayerObject> = res.data.map((player: PlayerObject) => {
    return player;
  });
  return playerResponse
}
const GetOnePlayer = async (id: number) => {
  const res = await axios.get(`/api/v1/players/getOne/${id}`)
  let player: PlayerObject = res.data
  return player
}


export { GetPlayers, DeletePlayer, NewPlayer, PlayerUpdate, GetOnePlayer }