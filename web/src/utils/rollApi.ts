import { ApiRequest } from "./Rollmein.api"
import { useMutation, useQuery } from "react-query"
import { useSession } from "next-auth/react"
import { useRollSlice } from "../stores/Roll.slice"
import { RestMethods } from "../types/RestMethods.enum"


const getRoll = async (groupId: string, sessionToken?: string) => {
  if (groupId && sessionToken) {
    const res = await ApiRequest<RollReturn, undefined>(`roll/${groupId}`, RestMethods.GET, { sessionToken })
    if (res) {
      return res
    }
  }
  return null
}

export const useRollQuery = (groupId: string) => {
  const setData = useRollSlice(state => state.setData)
  const session = useSession()
  return useQuery({
    queryKey: `roll/${groupId}`,
    queryFn: async () => {

      if (session.data?.id) {
        return await getRoll(groupId, session.data?.id)
      }
      return null
    },
    onSuccess: (data) => {
      if (data) {
        setData(data)
      }
    }
  })
}

const rollGroup = async (groupId: string, sessionToken?: string) => {
  if (groupId && sessionToken) {
    const res = await ApiRequest<RollReturn, undefined>(`roll/${groupId}`, RestMethods.POST, { sessionToken })
    if (res) {
      return res
    }
  }
  return null
}

export const useRollMutation = (groupId: string) => {
  const session = useSession()
  const sessionToken = session.data?.id
  const setData = useRollSlice(state => state.setData)
  return useMutation({
    mutationKey: `roll/${groupId}`,
    mutationFn: async () => {
      return await rollGroup(groupId, sessionToken)
    },
    onSuccess: (data) => {
      if (data) {
        setData(data)
      }
    }
  })
}
