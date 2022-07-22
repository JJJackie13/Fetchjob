import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("chatroom_users", (table) => {
        table.increments();
        table.integer("chatroom_id").unsigned();
        table.foreign("chatroom_id").references("chatrooms.id");
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("chatroom_users");
}
