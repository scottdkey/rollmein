import { useMutation, UseMutationOptions } from "react-query";
import { apiUrl } from "./constants";
import { RestMethods } from "../types/RestMethods.enum";
import { useSession } from "next-auth/react";



export async function ApiRequest<T, Res>(route: string, method: RestMethods, params: { body?: T, sessionToken?: string }) {
  let options: RequestInit = {
    method,
    headers: {
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
        ...options.headers,
        Authorization: `Bearer stuff`,
      }
    }
  }
  const res = await fetch(`${apiUrl}${route}`, options)

  const json = await res.json() as Res
  console.log({
    body: json
  })
  return json
}

export function Mutation<ReturnType, ErrorType, Params>(options: UseMutationOptions<ReturnType, ErrorType, Params>, route: string, method: RestMethods) {
  const { data: session } = useSession()
  return useMutation({
    mutationFn: (body) => ApiRequest<Params, ReturnType>(route, method, { body, sessionToken: session?.id }
    ),
    ...options
  })
}