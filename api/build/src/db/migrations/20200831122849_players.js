"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var up = function (knex) {
    return knex.schema.createTable("players", function (table) {
        table.increments("id");
        table.string("name").notNullable();
        table.boolean("tank").defaultTo(false);
        table.boolean("dps").defaultTo(false);
        table.boolean("healer").defaultTo(false);
        table.boolean("locked").defaultTo(false);
        table.boolean("in").defaultTo(false);
        table.uuid("user_id").unsigned().references("users.id").onDelete("CASCADE");
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
};
var down = function (knex) {
    return knex.schema.dropTable("players");
};
exports.default = { up: up, down: down };
