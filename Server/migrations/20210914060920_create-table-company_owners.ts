import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("company_owners", (table) => {
        table.increments();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("company_id").unsigned();
        table.foreign("company_id").references("companies.id");
        table.integer("control_level_id").unsigned();
        table.foreign("control_level_id").references("control_levels.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("company_owners");
}
