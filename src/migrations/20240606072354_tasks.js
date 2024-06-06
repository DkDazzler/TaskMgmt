/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("tasks", function (table) {
      table.increments("id").comment("primary key");
      table
      .integer("userId", 10)
      .unsigned()
      .notNullable()
      .references("users.id")
      .onDelete("CASCADE")
      .comment("FK->users.id");
      table.string("title", 60).notNullable();
      table.string("description", 100).notNullable();
      table.enu('status', ['pending', 'in-progress', 'completed']).defaultTo('pending');
      table.dateTime("createdAt").notNullable();
      table.dateTime("updatedAt").nullable();
    });
};
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.down = function (knex) {
    return knex.schema.dropTable("tasks");
};