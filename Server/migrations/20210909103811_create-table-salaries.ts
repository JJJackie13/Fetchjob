import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("salaries", (table) => {
        table.increments();
        table.integer("job_id").unsigned();
        table.foreign("job_id").references("jobs.id");
        table.integer("price_unit").unsigned();
        table.foreign("price_unit").references("price_units.id");
        table.integer("min");
        table.integer("max");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("salaries");
}
