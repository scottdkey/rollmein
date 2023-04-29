import { create } from 'zustand'
import { IGroup } from '../../types/Group'

interface GroupState {
  groups: IGroup[]
  setGroup: (group: IGroup) => void
  setGroups: (groups: IGroup[]) => void
  getGroup: (groupId: string) => IGroup | null
  error: string | null
}


export const useGroupSlice = create<GroupState>()((set) => {
  const setGroup = (group: IGroup) => set((state) => {
    const newGroups = state.groups
    const groupsReturn = newGroups.map(g => {
      if (g.id === group.id) {
        return group
      }
      return g
    })

    return { group, groups: groupsReturn }
  })

  return ({
    groups: [],
    error: null,
    setGroups: (groups: IGroup[]) => set({ groups }),
    setGroup,
    getGroup: (groupId: string) => {
      let group: IGroup | null = null
      set(state => {
        const res = state.groups.find(g => g.id === groupId)
        if (res) {
          group = res
        }
        return ({ ...state })
      })
      return group
    }
  })
})