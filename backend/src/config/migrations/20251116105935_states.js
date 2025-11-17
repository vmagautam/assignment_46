/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
   return knex.schema.createTable('states', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.timestamps(true, true);
    });
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTableIfExists('states');
};
