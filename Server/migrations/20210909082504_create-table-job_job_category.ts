import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("job_job_category", (table) => {
        table.increments();
        table.integer("job_id").unsigned();
        table.foreign("job_id").references("jobs.id");
        table.integer("category_id").unsigned();
        table.foreign("category_id").references("job_categories.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("job_job_category");
}
