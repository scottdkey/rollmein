import { ApiRequest } from "./Rollmein.api"
import { useMutation, useQuery } from "react-query"
import { useSession } from "next-auth/react"
import { useRollSlice } from "../stores/Roll.slice"
import { RestMethods } from "@sharedTypes/RestMethods.enum"


const getRoll = async (groupId: string, sessionToken?: string) => {
  if (groupId && sessionToken) {
    const res = await ApiRequest<IRoll, undefined>(`/roll/${groupId}`, RestMethods.GET, { sessionToken })
    if (res) {
      return res
    }
  }
  return null
}