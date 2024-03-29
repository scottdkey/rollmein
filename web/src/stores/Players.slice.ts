import { create } from 'zustand'
import { getGroupPlayers, getPlayer } from '../utils/player.api'

interface PlayersState {
  players: IPlayer[]
  loading: boolean
  setPlayers: (players: IPlayer[]) => void
  toggleLoading: () => void
  getPlayer: (playerId: string, sessionToken?: string) => Promise<void>
  getPlayers: (groupId: string, sessionToken: string) => Promise<void>
  handlePlayerChange: (player: IPlayer) => Promise<void>
  removePlayer: (playerId: string) => Promise<void>
}




export const usePlayersSlice = create<PlayersState>((set) => {
  return ({
    players: [],
    loading: false,
    setPlayers: (players: IPlayer[]) => set({ players }),
    toggleLoading: () => set((state) => ({ loading: !state.loading })),
    getPlayer: async (playerId: string, sessionToken?: string) => {
      const res = await getPlayer(playerId, sessionToken)
      set({ loading: true })
      if (res) {
        set((state) => ({ players: [...state.players, res] }))
      }
      if (!res) {
        console.error('no player found')
      }
    },
    getPlayers: async (groupId: string, sessionToken: string) => {
      const res = await getGroupPlayers(groupId, sessionToken)
      set({ loading: true })
      if (res) {
        set(() => ({ players: res }))
      }
      if (!res) {
        console.error('no player found')
      }
      set({ loading: false })
    },
    handlePlayerChange: async (player: IPlayer) => {
      set((state) => {
        const index = state.players.findIndex((p) => p.id === player.id)
        if (index === -1) return ({ players: [...state.players, player] })
        const newPlayers = [...state.players]
        newPlayers[index] = player
        return ({ players: newPlayers })
      })
    },
    removePlayer: async (playerId: string) => {
      set((state) => {
        const index = state.players.findIndex((p) => p.id === playerId)
        if (index === -1) return ({ players: [...state.players] })
        const newPlayers = [...state.players]
        newPlayers.splice(index, 1)
        return ({ players: newPlayers })
      })
    }
  })
})
