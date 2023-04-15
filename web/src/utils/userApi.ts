import { ApiRequest, UseMutation } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import { UseQueryOptions, useQuery } from "react-query"
import { useSession, signOut } from "next-auth/react"
import { useToast } from "@chakra-ui/react"

interface IFetchError {
  status: number,
  message: string
}

interface IMeRes { user: ScrubbedUser | null, success: boolean }
export enum UserRoutes {
  ME = 'user/me',
  PROFILE = 'user/profile'
}

export interface IProfileUpdateBody {
  username: string
}


export const getMe = async (sessionToken?: string) => {
  console.log(sessionToken)
  if (sessionToken) {
    return await ApiRequest<IMeRes, {}>(UserRoutes.ME, RestMethods.GET, { sessionToken })
  }
  return {
    user: null,
    success: false
  }
}

export const useMeQuery = (enabled: boolean = true) => {
  const session = useSession()
  const toast = useToast()
  const unableToSignIn = () => {
    toast({
      title: "unable to sign in",
      description: "something went wrong signing in, please try again"
    })
    signOut()
  }

  const options: UseQueryOptions<IMeRes | undefined, IFetchError> = {
    queryFn: async () => {
      const res = await getMe(session.data?.id)
      return res
    },
    queryKey: UserRoutes.ME,
    enabled: session.data?.id !== undefined || enabled,
    onError: (data) => {
      console.log(data)
      unableToSignIn()
    },
    onSettled: (data) => {
      if (data === undefined) {
        unableToSignIn()
      }
    }
  }
  return useQuery(options)
}

export const useProfileUpdateMutation = () =>
  UseMutation<ScrubbedUser | undefined, IFetchError, IProfileUpdateBody>(UserRoutes.PROFILE, RestMethods.POST, "updateProfile")