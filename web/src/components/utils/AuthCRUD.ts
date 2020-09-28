import { AuthObject, UserObject } from "./Interfaces"
import axios from "axios";
import env from "../../config"

const BASE_URL = `${env.API_URL}/auth`
export const Login = async (authObject: AuthObject, stateCallBack: Function) => {
  const res = await axios.post(`${BASE_URL}/login`, authObject);
  stateCallBack(res)
};
const checkError = (errorObject: any): string => {
  let message: string = ""
  console.log(errorObject)
  if (errorObject.message === "Request failed with status code 401") {
    message = "Current user is not Authorized to view this content"
  }
  return message
}


export const CheckStatus = async (updateAuth: Function, setError: Function) => {
  await axios.get(`${BASE_URL}/status`).then(res => updateAuth(res)).catch(err => { setError(checkError(err)) })
};

export const Logout = async (stateCallBack: Function) => {
  const res = await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
  stateCallBack(res)
};
export const Register = async (user: AuthObject, stateCallBack: Function) => {
  const res = await axios.post(`${BASE_URL}/register`, user);
  stateCallBack(res);
};
export const Update = async (user: UserObject, stateCallBack: Function) => {
  const res = await axios.patch(`${BASE_URL}/update`, user)
  stateCallBack(res)
}

