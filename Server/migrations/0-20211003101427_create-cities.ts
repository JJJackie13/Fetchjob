import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("cities", (table) => {
        table.increments();
        table.integer("country_id").unsigned();
        table.foreign("country_id").references("countries.id");
        table.string("name");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("cities");
}
