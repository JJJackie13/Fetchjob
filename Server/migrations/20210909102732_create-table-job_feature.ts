import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("job_feature", (table) => {
        table.increments();
        table.integer("job_id").unsigned();
        table.foreign("job_id").references("jobs.id");
        table.integer("feature_id").unsigned();
        table.foreign("feature_id").references("features.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("job_feature");
}
