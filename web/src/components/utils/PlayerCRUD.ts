import { PlayerFormObject, PlayerObject } from "./Interfaces"
import axios from "axios"


export const PlayerUpdate = async (updatedPlayer: PlayerObject, players: Array<PlayerObject>): Promise<PlayerObject[]> => {
  let updatedPlayers: Array<PlayerObject> | undefined
  const res = await axios.put(`/api/players/${updatedPlayer.id}`, updatedPlayer)
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

  return updatedPlayers!;
};

export const NewPlayer = async (newPlayer: PlayerFormObject, players: Array<PlayerObject>, id: number) => {
  const res = await axios.post(`/api/players/${id}`, newPlayer)
  const newPlayers: Array<PlayerObject> = [...players, ...res.data];
  return newPlayers
}
export const DeletePlayer = async (id: number, players: Array<PlayerObject>): Promise<PlayerObject[]> => {

  const res = await axios.delete(`/api/players/${id}`)
  let newPlayers: Array<PlayerObject> | undefined = []
  console.log(res)
  if (res.status === 200) {
    newPlayers = players.filter(
      (player: PlayerObject) => player.id !== res.data[0].id
    );
  }
  return newPlayers
}

export const GetPlayers = async (id: number) => {
  const res = await axios.get(`/api/players/${id}`);
  const playerResponse: Array<PlayerObject> = res.data.map((player: PlayerObject) => {
    return player;
  });
  return playerResponse
}