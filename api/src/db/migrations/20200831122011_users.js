exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable("users", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("email").notNullable().primary();
      table.string("username");
      table.string("password").notNullable();
      table.timestamps();
      table.unique("id");
      table.unique("email");
      table.unique("username");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
