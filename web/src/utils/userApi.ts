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

export const useMeQuery = () => useQuery<ScrubbedUser, IMeError>(UserRoutes.ME, async () => {
  return await ApiRequest<{}, ScrubbedUser>(UserRoutes.ME, RestMethods.GET)
}, {
  staleTime: 3000,
  useErrorBoundary: (error) => error.response?.status >= 300
})



export const useProfileUpdateMutation = (options: UseMutationOptions<ScrubbedUser, IMeError, IProfileUpdateBody>) =>
  Mutation(options, UserRoutes.PROFILE, RestMethods.POST)