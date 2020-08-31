exports.up = function (knex) {
  return knex.schema.createTable("players", (table) => {
    table.increments();
    table.string("name").notNullable();
    table.boolean("tank");
    table.boolean("dps");
    table.boolean("healer");
    table.boolean("locked");
    table.boolean("in");
    table
      .uuid("user_id")
      .unsigned()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("players");
};
