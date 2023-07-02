import { create } from 'zustand'
import { IGroup } from '../types/Group'
import { RollType } from '../types/RollType.enum'

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
  const setGroup = (group: IGroup) => set(() => {
    console.debug({ group })
    return {
      group,
      id: group.id,
      name: group.name,
      userId: group.userId,
      members: group.relations.members,
      players: group.relations.players,
      membersCanUpdate: group.membersCanUpdate,
      rollType: group.rollType ? group.rollType : RollType.FFA,
      lockAfterOut: group.lockAfterOut,
    }
  })
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