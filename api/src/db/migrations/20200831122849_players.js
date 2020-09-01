exports.up = function (knex) {
  return knex.schema.createTable("players", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.boolean("tank").defaultTo(false);
    table.boolean("dps").defaultTo(false);
    table.boolean("healer").defaultTo(false);
    table.boolean("locked").defaultTo(false);
    table.boolean("in").defaultTo(false);
    table
      .uuid("user_id")
      .unsigned()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("players");
};
