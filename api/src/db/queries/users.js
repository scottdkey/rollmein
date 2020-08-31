const bcrypt = require("bcryptjs");
const knex = require("../connection");

function addUser(user) {
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

module.exports = {
  addUser,
};
