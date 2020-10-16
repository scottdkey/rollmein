import { usePlayerData } from "../providers/PlayerProvider";
const { updatePlayer, removePlayer } = usePlayerData()!;

import { PlayerObject, RoleLogoImage } from "../../types/Interfaces";

export const apiRequest = async (
  url: string,
  method: string,
  bodyParams?: { email: string; password: string }
): Promise<any> => {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
    },
    body: bodyParams ? JSON.stringify(bodyParams) : undefined,
  });
  return await response.json();
};

