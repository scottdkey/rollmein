import { ApiRequest } from "./Rollmein.api"
import { useMutation, useQuery } from "react-query"
import { useSession, signOut } from "next-auth/react"
import { useToast } from "@chakra-ui/react"
import { RestMethods } from "@sharedTypes/RestMethods.enum"
import { UserRoutes } from "@sharedTypes/UserRoutes.enum"



export const getMe = async (sessionToken?: string) => {
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

  return useQuery({
    queryFn: async () => {
      if (session.data?.id) {
        return await getMe(session.data?.id)
      }
      return null
    },
    queryKey: UserRoutes.ME,
    enabled: session.data?.id !== undefined || enabled,
    onError: (data) => {
      console.error(data)
      unableToSignIn()
    },
    onSettled: (data) => {
      if (data === undefined) {
        unableToSignIn()
      }
    }
  })
}

export const useProfileUpdateMutation = () => {
  const session = useSession()
  const sessionToken = session.data?.id

  return useMutation({
    mutationFn: async (params: IProfileUpdateBody) => {
      const res = await ApiRequest<IMeRes, IProfileUpdateBody>(UserRoutes.PROFILE, RestMethods.PUT, { body: params, sessionToken })
      if (res) {
        return res
      }
      return null
    }

  })
}