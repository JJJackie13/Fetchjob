import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("applied_jobs", (table) => {
        table.increments();
        table.integer("user_id").references("users.id");
        table.integer("job_id").references("jobs.id");
        table.text("resume");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("applied_jobs");
}
