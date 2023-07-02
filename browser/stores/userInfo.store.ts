import { create } from 'zustand'
import { Database } from '../types_db'
import { supabaseBrowser } from '../libs/supabase.browser'

export type UserInfo = Database['public']['Tables']['user']['Row']
export type UserInsert = Database['public']['Tables']['user']['Insert']
export type UserUpdate = Database['public']['Tables']['user']['Update']

interface UserInfoState {
  userInfo: UserInfo | null
  get: (userId: string) => Promise<UserInfo | null>
}

const useUserInfoStore = create<UserInfoState>()((set) => {
  const supabase = supabaseBrowser()
  return ({
    userInfo: null,
    get: async (userId) => {
      const userInfoQuery = await supabase.from('user').select().eq('id', userId).single()
      const userInfo = userInfoQuery.data
      set({
        userInfo
      })
      return userInfo
    },
  })
})