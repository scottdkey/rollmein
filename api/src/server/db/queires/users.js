const bcrypt = require("bcryptjs");
const knex = require("../connection");

function addUser(user) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);
  return knex("users")
    .insert({
      uuid: user.uuid,
      email: user.email,
      password: hash,
      firstname: user.firstname,
      lastname: user.lastname,
    })
    .returning("*");
}

module.exports = {
  addUser,
};
