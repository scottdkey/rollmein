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


export const getMe = (sessionToken: string) => ApiRequest<{ user: ScrubbedUser | null, success: boolean }, {}>(UserRoutes.ME, RestMethods.GET, { sessionToken })

export const useMeQuery = (options?: UseQueryOptions<{ user: ScrubbedUser | null, success: boolean }, IMeError>) => {
  const { data: session } = useSession()
  const sessionToken = session?.id as string
  return useQuery({
    queryFn: async () => await getMe(sessionToken),
    queryKey: UserRoutes.ME,
    retry: false,
    staleTime: 10000,
    onError: (error) => { console.error(error) },
    useErrorBoundary: (error) => {
      console.error(error.response)
      return error.response?.status >= 300
    },
    ...options
  })
}

export const useProfileUpdateMutation = (options: UseMutationOptions<ScrubbedUser | undefined, IMeError, IProfileUpdateBody>) =>
  UseMutation(UserRoutes.PROFILE, RestMethods.POST, {
    mutationKey: UserRoutes.PROFILE,
    ...options
  })