import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import { apiUrl } from "./constants";
import { RestMethods } from "../types/RestMethods.enum";
import { useSession } from "next-auth/react";



export async function ApiRequest<Res, T>(route: string, method: RestMethods, params: { body?: T, sessionToken?: string }) {
  try {
    let options: RequestInit = {
      method,
      headers: {
        Authorization: "",
        'content-type': 'application/json'
      },
      credentials: 'include',
    }

    if (method !== RestMethods.GET && params.body) {
      const setupBody = params.body && JSON.stringify(params.body)

      options = {
        ...options,
        body: setupBody
      }

    }

    if (params.sessionToken) {
      options = {
        ...options,
        headers: {
          Authorization: `Bearer ${params.sessionToken}`,
          'content-type': 'application/json'
        }
      }
    }
    const res = await fetch(`${apiUrl}${route}`, options)
    if (res.ok) {
      return await res.json() as Res
    }
    return
  } catch (e: any) {
    throw {
      message: e.message,
      status: e.status
    }
  }
}

export function UseQuery<ReturnType, ErrorType>(
  route: string, queryKey: string, enabled: boolean, routeParam?: string) {
  const { data: session } = useSession()
  const sessionToken = session?.id

  const routeParamUndefined = routeParam === undefined

  const options: UseQueryOptions<ReturnType | undefined, ErrorType> = {
    queryKey,
    queryFn: async () => {
      if (routeParamUndefined) {
        return undefined
      }
      return await ApiRequest<ReturnType, {}>(route, RestMethods.GET, { sessionToken })
    },
    enabled,
  }
  return useQuery({ ...options })
}

export function UseMutation<ReturnType, ErrorType, Body>(route: string, method: RestMethods, mutationKey: string) {
  const { data: session } = useSession()
  const sessionToken = session?.id

  const options: UseMutationOptions<ReturnType | undefined, ErrorType, Body> = {
    mutationKey,
    mutationFn: async (body) => {
      if (sessionToken === undefined) {
        return undefined
      }
      return await ApiRequest<ReturnType, Body>(route, method, { body, sessionToken })
    }

  }
  return useMutation(options)
}