import { create } from 'zustand'
import { IGroup } from '../types/Group'

interface GroupState {
  groups: IGroup[]
  setGroups: (groups: IGroup[]) => void
  upsertGroup: (group: IGroup) => void
  error: string | null
}


export const useGroupSlice = create<GroupState>((set) => {

  const upsertGroup = (group: IGroup) => set((state) => {
    const newGroups = state.groups
    const existing = newGroups.findIndex(item => item.id === group.id)

    if (existing) {
      newGroups[existing] = group
      return {
        ...state,
        groups: newGroups
      }
    }
    return {
      ...state,
      groups: newGroups
    }
  })
  const setGroups = (groups: IGroup[]) => set({ groups })

  return ({
    groups: [],
    error: null,
    setGroups,
    upsertGroup
  })
})