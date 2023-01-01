import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import { apiUrl } from "./constants";
import { RestMethods } from "../types/RestMethods.enum";
import { useSession } from "next-auth/react";



export async function ApiRequest<Res, T>(route: string, method: RestMethods, params: { body?: T, sessionToken?: string }) {
  try {
    let options: RequestInit = {
      method,
      headers: {
        'content-type': 'application/json',
        Authorization : ""
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
    const res = await fetch(`${apiUrl}${route}`, options)
    if (!res.ok) {
      throw Error(`Fetch Error: ${res.statusText}, Code ${res.status}`)
    }
    return await res.json() as Res
  } catch (e: any) {
    throw Error(`request error: ${e}`)
  }
}

export function UseQuery<ReturnType, ErrorType>(
  route: string, options: UseQueryOptions<ReturnType, ErrorType>) {
  const { data: session } = useSession()
  const sessionToken = session?.id
  return useQuery({
    queryFn: () => ApiRequest<ReturnType, {}>(route, RestMethods.GET, { sessionToken }),
    ...options
  })
}

export function UseMutation<ReturnType, ErrorType, Body>(route: string, method: RestMethods, options: UseMutationOptions<ReturnType, ErrorType, Body>) {
  const { data: session } = useSession()
  const sessionToken = session?.id
  return useMutation({
    mutationFn: (body) => ApiRequest<ReturnType, Body>(route, method, { body, sessionToken }
    ),
    ...options
  })
}