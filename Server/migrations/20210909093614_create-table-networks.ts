import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("networks", (table) => {
        table.increments();
        table.integer("requester_id").unsigned();
        table.foreign("requester_id").references("users.id");
        table.integer("receiver_id").unsigned();
        table.foreign("receiver_id").references("users.id");
        table.boolean("is_pending").defaultTo(true);
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("networks");
}
