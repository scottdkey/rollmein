import { create } from 'zustand'
import { IGroup } from '@sharedTypes/Group'
import { RollType } from '../utils/group.api'

interface CurrentGroupState {
  group: IGroup | null
  id: string
  name: string
  userId: string
  members: string[]
  players: string[]
  membersCanUpdate: boolean
  rollType: RollType
  lockAfterOut: boolean
  error: string | null
  setGroup: (group: IGroup) => void
}


export const useCurrentGroupSlice = create<CurrentGroupState>((set) => {
  const setGroup = (group: IGroup) => set({ ...group, group })
  return ({
    group: null,
    id: "",
    name: '',
    userId: '',
    members: [],
    players: [],
    membersCanUpdate: false,
    rollType: RollType.FFA,
    lockAfterOut: false,
    error: null,
    setGroup,
  })
})