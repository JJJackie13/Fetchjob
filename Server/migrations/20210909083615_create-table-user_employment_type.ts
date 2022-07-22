import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user_employment_type", (table) => {
        table.increments();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("type_id").unsigned();
        table.foreign("type_id").references("employment_types.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("user_employment_type");
}
