import { UseMutationOptions, useQuery } from "react-query"
import { ScrubbedUser } from "./authApi"
import { ApiRequest, Mutation, RestMethods } from "./Rollmein.api"

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

export const useMeQuery = () => useQuery<{ user: ScrubbedUser | null, success: boolean }, IMeError>(UserRoutes.ME, async () => {
  return await ApiRequest<{}, { user: ScrubbedUser | null, success: boolean }>(UserRoutes.ME, RestMethods.GET)
}, {
  retry: false,
  staleTime: 3000,
  onError: (error) => { console.error(error) },
  useErrorBoundary: (error) => {
    console.error(error.response)
    return error.response?.status >= 300
  }
})



export const useProfileUpdateMutation = (options: UseMutationOptions<ScrubbedUser | undefined, IMeError, IProfileUpdateBody>) =>
  Mutation(options, UserRoutes.PROFILE, RestMethods.POST)