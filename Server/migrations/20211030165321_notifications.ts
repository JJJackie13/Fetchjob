import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("notification_types", (table) => {
        table.increments();
        table.string("name");
        table.timestamps(false, true);
    });
    await knex.schema.createTable("notifications", (table) => {
        table.increments();
        table.integer("user_id").references("users.id");
        table.integer("primary_id");
        table.integer("type_id").references("notification_types.id");
        table.text("content");
        table.boolean("is_read");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("notifications");
    await knex.schema.dropTableIfExists("notification_types");
}
