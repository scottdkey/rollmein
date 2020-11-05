"use strict";
const up = (knex) => {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable("users", (table) => {
        table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.string("email").notNullable();
        table.string("username");
        table.string("password").notNullable();
        table.string("appleAuth");
        table.string("twitterAuth");
        table.string("googleAuth");
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.unique("email");
        table.unique("username");
        table.unique("appleAuth");
        table.unique("googleAuth");
        table.unique("twitterAuth");
    });
};
const down = (knex) => {
    return knex.schema.dropTable("users");
};
module.exports = { up, down };