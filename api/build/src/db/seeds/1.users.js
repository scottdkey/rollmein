"use strict";
const bcrypt = require("bcryptjs");
module.exports.seed = (knex) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync("password", salt);
    return knex("users")
        .del()
        .then(async () => {
        const res = await knex("users")
            .insert({
            email: "test@test.com",
            username: "testing",
            password: hash,
        })
            .returning("*");
    });
};
