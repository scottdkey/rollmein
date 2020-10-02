import { PlayerFormObject, PlayerObject } from "./Interfaces"
import { createInGroup } from "./BaseAppLogic"
import axios from "axios"
import env from "../../config"


const BASE_URL = `${env.API_URL}/players`

const PlayerUpdate = async (updatedPlayer: PlayerObject, players: Array<PlayerObject>, stateCallBack: Function) => {
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

  stateCallBack(updatedPlayers);
};

const NewPlayer = async (newPlayer: PlayerFormObject, players: Array<PlayerObject>, id: number, setPlayers: Function) => {
  const res = await axios.post(`${BASE_URL}/${id}`, newPlayer)
  const newPlayers: Array<PlayerObject> = [...players, ...res.data];
  return newPlayers
}
const DeletePlayer = async (id: number, players: Array<PlayerObject>, setPlayers: Function) => {

  const res = await axios.delete(`/api/players/${id}`)
  let newPlayers: Array<PlayerObject> | undefined = []
  if (res.status === 200) {
    newPlayers = players.filter(
      (player: PlayerObject) => player.id !== res.data[0].id
    );
  }
  setPlayers(newPlayers)
}

const GetPlayers = async (id: number, setPlayers: Function, setInGroup: Function) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  let playerResponse: Array<PlayerObject> = []
  if (res.status === 200) {
    playerResponse = res.data.map((player: PlayerObject) => {
      return player;
    });
  }
  setInGroup(createInGroup(playerResponse))
  setPlayers(playerResponse)
}

export { GetPlayers, DeletePlayer, NewPlayer, PlayerUpdate }