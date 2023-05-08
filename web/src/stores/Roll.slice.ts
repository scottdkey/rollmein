import { create } from 'zustand'

interface RollState {
  currentRoll: IRoll
  previousRolls: IRoll[]
  remainingPlayers: string[]
  rollSize: number
  active: boolean
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
    active: false,
    rollSize: 5,
    error: null,
  })
})