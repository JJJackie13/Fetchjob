import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("education", (table) => {
        table.increments();
        table.string("name");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("education");
}
