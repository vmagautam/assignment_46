/**
 * Migration: Create clients table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('company', function(table) {
  
    table.increments('id').primary();
    table.string('business_entity')
      .notNullable()
      .comment('Type of business entity');
    table.string('business_name', 255).notNullable();
    
    table.string('contact_name', 255).notNullable();
    table.string('contact_number', 20).nullable();
    table.string('email_id', 255).nullable();
    
    table.string('client_id', 100).unique().nullable()
      .comment('Custom client identifier');
    table.string('currency', 3).defaultTo('INR')
      .comment('ISO 4217 currency code');
    table.date('client_creation_date').notNullable().defaultTo(knex.fn.now());
    
    
    table.boolean('is_active').defaultTo(true).notNullable();
    
    table.timestamps(true, true);
    
    table.timestamp('deleted_at').nullable();
    
    table.index('business_name');
    table.index('contact_name');
    table.index('email_id');
    table.index('is_active');
    table.index(['deleted_at', 'created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists('company');
};