/**
 * Migration: Create client_gst_details table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('client_gst_details', function(table) {
    table.increments('id').primary();
    table.integer('company_id').unsigned().notNullable();
    table.string('client_id', 50).notNullable();
    table.foreign('company_id')
      .references('id')
      .inTable('company')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    
    table.string('gstin', 15).notNullable()
      .comment('Goods and Services Tax Identification Number');
    table.enum('gst_registration_type', ['Regular', 'Composition', 'Unregistered'])
      .notNullable()
      .defaultTo('Regular');
    table.date('gst_registration_date').nullable();
    
    table.string('state', 100).notNullable();
    table.string('pincode', 10).nullable();
    table.text('address').nullable();
    table.text('address_line_2').nullable();
    
    table.string('legal_name', 255).nullable()
      .comment('Legal business name as per GST certificate');
    
    table.boolean('is_verified').defaultTo(false)
      .comment('Whether GSTIN has been verified');
    table.timestamp('verified_at').nullable();
    table.boolean('is_active').defaultTo(true).notNullable()
      .comment('Whether this GST registration is currently active');
    table.boolean('is_primary').defaultTo(false).notNullable()
      .comment('Primary GSTIN for the client');
    
    table.date('gst_cancellation_date').nullable();
    table.text('cancellation_reason').nullable();
    
    table.timestamps(true, true);
    
    table.timestamp('deleted_at').nullable();


    table.index('gstin');
    table.index('is_active');
    table.index('is_primary');
    table.index('company_id');
    table.index('client_id');
    table.index(['company_id', 'is_primary']);
    table.index(['company_id', 'is_active']);
    

    table.unique(['gstin']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists('client_gst_details');
};