import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("post_report_types", (table) => {
        table.increments();
        table.string("name");
        table.timestamps(false, true);
    });

    await knex.schema.createTable("post_reports", (table) => {
        table.increments();
        table.integer("post_id").references("posts.id");
        table.integer("type_id").references("post_report_types.id");
        table.integer("reporter_id").references("users.id");
        table.text("remark");
        table.boolean("is_solved").defaultTo(false);
        table.timestamp("solved_at").defaultTo(knex.fn.now());
        table.timestamps(false, true);
    });

    await knex.schema.createTable("report_types", (table) => {
        table.increments();
        table.string("name");
        table.timestamps(false, true);
    });

    await knex.schema.createTable("user_reports", (table) => {
        table.increments();
        table.integer("user_id").references("users.id");
        table.integer("type_id").references("report_types.id");
        table.integer("reporter_id").references("users.id");
        table.text("remark");
        table.boolean("is_solved").defaultTo(false);
        table.timestamp("solved_at").defaultTo(knex.fn.now());
        table.timestamps(false, true);
    });

    await knex.schema.createTable("company_reports", (table) => {
        table.increments();
        table.integer("company_id").references("companies.id");
        table.integer("type_id").references("report_types.id");
        table.integer("reporter_id").references("users.id");
        table.text("remark");
        table.boolean("is_solved").defaultTo(false);
        table.timestamp("solved_at").defaultTo(knex.fn.now());
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("post_reports");
    await knex.schema.dropTableIfExists("user_reports");
    await knex.schema.dropTableIfExists("company_reports");
    await knex.schema.dropTableIfExists("report_types");
    await knex.schema.dropTableIfExists("post_report_types");
}
