import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("subcomment_likes", (table) => {
        table.increments();
        table
            .integer("subcomment_id")
            .references("post_subcomments.id")
            .onDelete("CASCADE");
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("subcomment_likes");
}
