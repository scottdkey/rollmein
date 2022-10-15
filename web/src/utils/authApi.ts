import { supabase } from './supabase.client';
import { apiUrl } from "./constants"

export const apiValidateSignIn = async (tokens: {
  accessToken: string
  expirationTime: number
  refreshToken: string
  isExpired: () => boolean
}) => {
  try {
    return await fetch(`${apiUrl}auth/validate`, {
      method: RestMethods.POST,
      body: JSON.stringify(tokens),
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      },
      credentials: 'include',
    })
  } catch (e) {
    console.error(e)
    return
  }
}

export enum RestMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  HEAD = "HEAD"
}


