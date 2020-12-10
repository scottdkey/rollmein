import { AuthObject, UserObject } from "../../types/Interfaces"
import axios from "axios";


const BASE_URL = `/api/v1/auth`
const Login = async (authObject: AuthObject) => {
  const res = await axios.post(`/auth/login`, authObject)
  console.log(res)
  return res
};

const CheckStatus = async () => {
  const res = await axios.get(`${BASE_URL}/status`)
  return res
};

const Logout = async () => {
  const res = await axios.get(`/auth/logout`, { withCredentials: true });
  return res
};
const Register = async (user: AuthObject) => {
  const res = await axios.post(`/auth/register`, user);
  console.log(res)
  return res
};
const Update = async (user: UserObject) => {
  const res = await axios.patch(`/auth/update`, user)
  return res
}

export { Login, Logout, Register, Update, CheckStatus }