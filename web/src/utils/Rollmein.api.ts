import { QueryFunction, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import { apiUrl } from "./constants";
import { RestMethods } from "../types/RestMethods.enum";
import { useSession } from "next-auth/react";



export async function ApiRequest<Res, T>(route: string, method: RestMethods, params: { body?: T, sessionToken?: string }) {
  let options: RequestInit = {
    method,
    headers: {
      'content-type': 'application/json',
      Authorization: ""
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
        ...options.headers,
        Authorization: `Bearer ${params.sessionToken}`,
      }
    }
  }
  return await fetch(`${apiUrl}${route}`, options)
}

export function UseQuery<ReturnType, ErrorType>(
  route: string, queryKey: string, routeParam?: string) {
  const { data: session } = useSession()
  const sessionToken = session?.id

  const routeParamUndefined = routeParam === undefined

  const options: UseQueryOptions<ReturnType | undefined, ErrorType> = {
    queryKey,
    queryFn: async () => {
      if (routeParamUndefined) {
        return undefined
      }
      if (session?.id === undefined) {
        return undefined
      }
      const res = await ApiRequest<ReturnType, {}>(route, RestMethods.GET, { sessionToken })
      if (res.status < 400) {
        return await res.json() as ReturnType
      }
      return undefined
    },
  }
  return useQuery({
    ...options
  })
}

export function UseMutation<ReturnType, ErrorType, Body>(route: string, method: RestMethods, mutationKey: string) {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const options: UseMutationOptions<ReturnType | undefined, ErrorType, Body> = {
    mutationKey,
    mutationFn: async (body) => {
      const res = await ApiRequest(route, method, { body, sessionToken })
      if (sessionToken === undefined) {
        return undefined
      }
      if (res.status < 400) {
        return await res.json() as ReturnType
      }
      return undefined
    }

  }
  return useMutation(options)

}