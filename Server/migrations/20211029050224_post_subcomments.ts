import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("post_subcomments", (table) => {
        table.increments();
        table.integer("comment_id").unsigned();
        table
            .foreign("comment_id")
            .references("post_comments.id")
            .onDelete("CASCADE");
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.text("content");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("post_subcomments");
}
