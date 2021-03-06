import { AuthObject, UserObject } from "../types/Interfaces"
import axios from "axios";


const BASE_URL = `/api/v1/auth`
const Login = async (authObject: AuthObject) => {
  const res = await axios.post(`${BASE_URL}/login`, authObject)
  return res
};

const CheckStatus = async () => {
  const res = await axios.get(`${BASE_URL}/status`)
  return res
};

const Logout = async () => {
  const res = await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
  return res
};
const Register = async (user: AuthObject) => {
  const res = await axios.post(`${BASE_URL}/register`, user);
  return res
};
const Update = async (user: UserObject) => {
  const res = await axios.patch(`${BASE_URL}/update`, user)
  return res
}

export { Login, Logout, Register, Update, CheckStatus }