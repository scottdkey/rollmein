import { create } from 'zustand'
import { IGroup } from '@sharedTypes/Group'

interface GroupState {
  groups: IGroup[]
  setGroup: (group: IGroup) => void
  setGroups: (groups: IGroup[]) => void
  error: string | null
}


export const useGroupSlice = create<GroupState>((set) => {
  const setGroup = (group: IGroup) => set((state) => {
    const newGroups = state.groups
    const existing = newGroups.findIndex(item => item.id === group.id)

    if (existing) {
      const groupsReturn = newGroups.map(g => {
        if (g.id === group.id) {
          return group
        }
        return g
      })

      return { groups: groupsReturn }
    }
    if (!existing) {
      return { groups: [...newGroups, group] }
    }
    return {
      groups: newGroups
    }
  })

  return ({
    groups: [],
    error: null,
    setGroups: (groups: IGroup[]) => set({ groups }),
    setGroup,
  })
})