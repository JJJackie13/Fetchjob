import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("saved_jobs", (table) => {
        table.increments();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("job_id").unsigned();
        table.foreign("job_id").references("jobs.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("saved_jobs");
}
