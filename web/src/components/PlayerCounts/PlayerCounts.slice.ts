import { create } from 'zustand'
import { v4 } from "uuid"
import { IGroupPlayerCountResponse } from '../../types/Group'

interface PlayerCountsState {
  playerCounts: IGroupPlayerCountResponse | null
  setPlayerCounts: (playerCounts: IGroupPlayerCountResponse) => void
}


export const usePlayerCountsSlice = create<PlayerCountsState>()((set) => {
  return ({
    playerCounts: {
      tanks: 0,
      healers: 0,
      dps: 0,
      locked: 0,
      inTheRoll: 0,
    },
    setPlayerCounts: (playerCounts: IGroupPlayerCountResponse) => set({ playerCounts }),
  }
  )
})