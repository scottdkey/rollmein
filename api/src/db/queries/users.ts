import bcrypt from "bcryptjs";
import knex from "../connection.js";

interface userObject {
  
}

function addUser(user: object) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);
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
