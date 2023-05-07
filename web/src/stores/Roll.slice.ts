import { create } from 'zustand'

export interface IRoll {
  tank: IPlayer | null
  healer: IPlayer | null
  dps: IPlayer[] | null
  ffa: IPlayer[] | null
}

interface RollState {
  currentRoll: IRoll
  previousRolls: IRoll[]
  remainingPlayers: IPlayer[]
  rollSize: number
  error: string | null
}


export const useRollSlice = create<RollState>((set) => {
  return ({
    currentRoll: {
      tank: null,
      healer: null,
      dps: null,
      ffa: null,
    },
    remainingPlayers: [],
    previousRolls: [],
    rollSize: 5,
    error: null,
  })
})