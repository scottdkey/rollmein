import { create } from 'zustand'
import { IGroupPlayerCountResponse } from '@sharedTypes/Group'
import { RollType } from '../utils/group.api'

interface PlayerCountsState {
  playerCounts: IGroupPlayerCountResponse | null
  setPlayerCounts: (playerCounts: IGroupPlayerCountResponse) => void
}


export const usePlayerCountsSlice = create<PlayerCountsState>((set) => {
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