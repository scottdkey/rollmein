exports.up = function (knex) {
  return knex.schema.createTable("userOptions", (table) => {
    table.increments("id");
    table.string("rollType");
    table.boolean("lockAfterOut");
    table.string("theme");
    table.uuid("user_id").unsigned().references("users.id").onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("players");
};
