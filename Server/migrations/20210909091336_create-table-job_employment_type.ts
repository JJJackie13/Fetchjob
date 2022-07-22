import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("job_employment_type", (table) => {
        table.increments();
        table.integer("job_id").unsigned();
        table.foreign("job_id").references("jobs.id");
        table.integer("type_id").unsigned();
        table.foreign("type_id").references("employment_types.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("job_employment_type");
}
