import { RestMethods } from "../types/RestMethods.enum";
import { ApiRequest } from "./Rollmein.api";
import {IValidateAuthRes, IValidateAuthBody} from "@apiTypes/ValidateAuth"

export enum AuthRoutes {
  VALIDATE = `auth/validate`,
}


export const validateAuthRequest = async (body: IValidateAuthBody) => {
  return await ApiRequest<IValidateAuthRes, IValidateAuthBody>(AuthRoutes.VALIDATE, RestMethods.POST, { body })
}




