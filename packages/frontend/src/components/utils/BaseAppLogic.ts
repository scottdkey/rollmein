import { PlayerObject } from "../../types/Interfaces";

type rollCountObject = {
  Tanks: number,
  Dps: number,
  Healers: number,
  inCount: number
}

const validCheck = ({ Tanks, Dps, Healers, inCount }: rollCountObject) => {
  const tanks = Tanks > 0;
  const dps = Dps >= 3;
  const healers = Healers > 0;
  const rolesValid = tanks === true && dps === true && healers === true
  const groupValid = inCount >= 6 ? true : false

  const isValid = groupValid === true && rolesValid === true;
  return isValid;
};


const placeHolderArray: Array<PlayerObject> = [
  {
    playerName: "",
    tank: false,
    dps: false,
    healer: false,
    locked: false,
    inTheRoll: false,
    id: 999999,
    userId: "placeHolder",
  },
];

export { validCheck }
