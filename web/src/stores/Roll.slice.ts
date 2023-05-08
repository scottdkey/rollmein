import { create } from 'zustand'

interface RollState {
  currentRoll: IRoll | null
  previousRolls: IRoll[]
  remainingPlayers: string[]
  rollSize: number
  active: boolean
  error: string | null
  setData: (data: RollReturn) => void
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
    setData: (data) => {
      set({
        currentRoll: data.currentRoll,
        remainingPlayers: data.remainingPlayers,
        previousRolls: data.previousRolls,
      })
    }
  })
})