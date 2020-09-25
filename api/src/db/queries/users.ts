import bcrypt from "bcryptjs";
import knex from "../connection.js";
import { UserObject } from "../../../config/interfaces"


function addUser(user: UserObject) {
  const salt = bcrypt.genSaltSync();
  const hash: string = bcrypt.hashSync(user.password, salt);
  return knex("users")
    .insert({
      email: user.email,
      password: hash,
      username: user.username,
    })
    .returning("*");
}
function getAllUsers() {
  return knex("users").select("*");
}

export default { addUser, getAllUsers };
