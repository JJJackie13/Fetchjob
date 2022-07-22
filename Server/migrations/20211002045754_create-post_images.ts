import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("post_images", (table) => {
        table.increments();
        table.integer("post_id").unsigned();
        table.foreign("post_id").references("posts.id").onDelete("CASCADE");
        table.text("image");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("post_images");
}
