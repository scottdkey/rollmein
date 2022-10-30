import { MutationOptions, useMutation, UseMutationOptions, useQuery } from "react-query";
import { RestMethods, ApiResponse, ApiRequest } from "./Rollmein.api";

export enum AuthRoutes {
  VALIDATE = `auth/validate`,
  LOGOUT = "auth/logout"
}

export interface ITokens {
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
  isExpired: () => boolean;
}

export interface ScrubbedUser {
  id: string
  username: string
}
export interface IValidateResponse extends ApiResponse<ScrubbedUser> { }


export const useValidateSignInMutation = (options: UseMutationOptions<ScrubbedUser, unknown, ITokens, unknown>) => useMutation(async (tokens: ITokens) => {
  return await ApiRequest<ITokens, ScrubbedUser>(AuthRoutes.VALIDATE, RestMethods.POST, tokens, tokens.accessToken)
}, options)

export const useLogoutMutation = (options: UseMutationOptions<unknown, unknown, unknown, unknown>) => useMutation(async () => {
  return await ApiRequest(AuthRoutes.LOGOUT, RestMethods.DELETE)
}, options)




