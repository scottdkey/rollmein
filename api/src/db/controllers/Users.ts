import { DefaultContext } from "koa"
import { User, UserInterface } from "../models/User"
import bcrypt from "bcryptjs";

export const addUser = async (ctx: DefaultContext) => {
  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync();
  const hash: string = bcrypt.hashSync(password, salt)
  const newUser: UserInterface = { ...ctx.request.body, password: hash }
  await User.create<User>(newUser).then((user: User) => {
    ctx.status = 201;
    ctx.body = user;
  }).catch((err: Error) => {
    ctx.throw(500, "Unable to create new User")
    ctx.error = err
  })
}
export const getAllUsers = () => {
  User.findAll({})
}