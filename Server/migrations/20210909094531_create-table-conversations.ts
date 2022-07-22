import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("conversations", (table) => {
        table.increments();
        table.integer("sender_id").unsigned();
        table.foreign("sender_id").references("users.id");
        // table.integer("receiver_id").unsigned();
        // table.foreign("receiver_id").references("users.id");
        table.text("content");
        table.integer("room_id").unsigned();
        table.foreign("room_id").references("chatrooms.id");
        table.boolean("is_sent").defaultTo(true);
        table.boolean("is_received").defaultTo(false);
        table.boolean("is_read").defaultTo(false);
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("conversations");
}
