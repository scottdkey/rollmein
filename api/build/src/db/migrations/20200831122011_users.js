"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var up = function (knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable("users", function (table) {
        table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.string("email").notNullable();
        table.string("username");
        table.string("password").notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.unique("email");
        table.unique("username");
    });
};
var down = function (knex) {
    return knex.schema.dropTable("users");
};
exports.default = { up: up, down: down };
