import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("company_reviews", (table) => {
        table.increments();
        table.integer("user_id").references("users.id");
        table.string("job_title");
        table.integer("commenter_type_id").unsigned();
        table.foreign("commenter_type_id").references("commenter_types.id");
        table.integer("employment_type_id").references("employment_types.id");
        table.integer("company_id").unsigned();
        table.foreign("company_id").references("companies.id");
        table.integer("rating");
        table.text("review_title");
        table.text("pos_comment");
        table.text("neg_comment");
        table.text("extra_comment");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("company_reviews");
}
