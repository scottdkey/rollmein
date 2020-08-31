const bcrypt = require("bcryptjs");

exports.seed = (knex) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync("password", salt);
  return knex("users")
    .del()
    .then(() => {
      return knex("users")
        .insert({
          email: "test@test.com",
          username: "testing",
          password: hash,
        })
        .returning("*");
    });
};
