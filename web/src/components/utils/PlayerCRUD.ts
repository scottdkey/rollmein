import { PlayerObject } from "./Interfaces"

export const PlayerUpdate = (updatedPlayer: PlayerObject, players: Array<PlayerObject>): Array<PlayerObject> => {
  const updatedPlayers = players.map((p) => {
    if (p.id === updatedPlayer.id) {
      const player = updatedPlayer;
      return player;
    } else {
      return p;
    }
  });

  return updatedPlayers;
};

export const NewPlayer = (newPlayer: PlayerObject, players: Array<PlayerObject>): Array<PlayerObject> => {
  const newPlayers = [...players, newPlayer];
  return newPlayers
}
export const DeletePlayer = (id: number, players: Array<PlayerObject>): Array<PlayerObject> => {
  const newPlayers = players.filter(
    (player: PlayerObject) => player.id !== id
  );
  return newPlayers
}