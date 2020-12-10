import { AuthObject, UserObject } from "../../types/Interfaces"
import axios from "axios";

const Login = async (authObject: AuthObject) => {
  const res = await axios.post(`/api/v1/auth/login`, authObject)
  console.log(res)
  return res
};

const CheckStatus = async () => {
  const res = await axios.get(`/api/v1/auth/status`)
  return res
};

const Logout = async () => {
  const res = await axios.get(`/api/v1/auth/logout`, { withCredentials: true });
  return res
};
const Register = async (user: AuthObject) => {
  const res = await axios.post(`api/v1/auth/register`, user);
  console.log(res)
  return res
};
const Update = async (user: UserObject) => {
  const res = await axios.patch(`api/v1/auth/update`, user)
  return res
}

export { Login, Logout, Register, Update, CheckStatus }