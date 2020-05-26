// Basic table
exports.up = (knex) => {
    return knex.schema.createTable('users', (table) => {
        table.increments().primary();
        table.string('name').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('users');
};
