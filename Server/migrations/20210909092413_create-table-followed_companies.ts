import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("followed_companies", (table) => {
        table.increments();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("company_id").unsigned();
        table.foreign("company_id").references("companies.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("followed_companies");
}
