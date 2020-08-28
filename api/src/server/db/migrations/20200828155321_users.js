exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id");
    table.string("email").unique().notNullable().primary();
    table.string("firstname");
    table.string("lastname");
    table.string("password").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
