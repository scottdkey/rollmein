import { DefaultContext } from "koa"
import { User, UserInterface } from "../models/user"
import bcrypt from "bcryptjs";

const addUser = async (ctx: DefaultContext) => {
  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync();
  const hash: string = bcrypt.hashSync(password, salt)
  const newUser: UserInterface = { ...ctx.request.body, password: hash }
  await User
    .create<User>(newUser)
    .then((user: User) => {
      ctx.status = 201;
      ctx.body = user;
    }).catch((err: Error) => {
      console.log(err)
      ctx.error = err
    })
  return ctx
}

const getUser = async (id: number, done: any) => {
  return await User.findAll({
    where: {
      id
    }
  }).then((res) => {
    const user: UserInterface = res[0]
    done(null, user);
  })
    .catch((err: any) => {
      done(err, null);
    });
}
const getAllUsers = () => {
  User.findAll({})
}

const checkUserPassword = async (email: string, password: string, done: any) => {
  return await User.findAll({
    where: {
      email
    }
  })
    .then((res) => {
      const user = res[0]
      if (!user) return done(null, false);
      if (!comparePass(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
    .catch((err: any) => {
      return done(err);
    });
}

function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}


export { addUser, getUser, getAllUsers, checkUserPassword }