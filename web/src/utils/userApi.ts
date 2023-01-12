import { UseMutationOptions, UseQueryOptions, useQuery } from "react-query"
import { ApiRequest, UseMutation, UseQuery } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import { ScrubbedUser } from "@apiTypes/User"
import { useSession } from "next-auth/react"

interface IMeError {
  response: {
    status: number
  }
}
export enum UserRoutes {
  ME = 'user/me',
  PROFILE = 'user/profile'
}

export interface IProfileUpdateBody {
  username: string
}


export const getMe = async (sessionToken?: string) => {
  if (sessionToken) {
    return await ApiRequest<{ user: ScrubbedUser, success: boolean }, {}>(UserRoutes.ME, RestMethods.GET, { sessionToken })
  }
  return {
    user: null,
    success: false
  }
}

export const useMeQuery = () => {
  return UseQuery<{ user: ScrubbedUser | null, success: boolean }, IMeError>(UserRoutes.ME, UserRoutes.ME, UserRoutes.ME)
}

export const useProfileUpdateMutation = () =>
  UseMutation<ScrubbedUser | undefined, IMeError, IProfileUpdateBody>(UserRoutes.PROFILE, RestMethods.POST, "updateProfile")