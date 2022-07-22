import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("job_skills", (table) => {
        table.increments();
        table.integer("job_id").unsigned();
        table.foreign("job_id").references("jobs.id");
        table.text("content");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("job_skills");
}
