import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("post_likes", (table) => {
        table.increments();
        table.integer("post_id").unsigned();
        table.foreign("post_id").references("posts.id").onDelete("CASCADE");
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("post_likes");
}
