import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("companies", (table) => {
        table.increments();
        table.integer("name_id").unsigned();
        table.foreign("name_id").references("company_names.id");
        table.text("introduction");
        table.text("website");
        table.text("avatar");
        table.text("banner");
        table.integer("city_id").unsigned();
        table.foreign("city_id").references("cities.id");
        table.text("address");
        table.text("email");
        table.bigInteger("phone");
        table.integer("type_id").unsigned();
        table.foreign("type_id").references("company_types.id");
        table.integer("industry_id").unsigned();
        table.foreign("industry_id").references("industries.id");
        table.integer("business_size");
        table.integer("establish_in");
        table.text("company_registry");
        table.boolean("is_verified").defaultTo(false);
        table.boolean("is_activated").defaultTo(false);
        table.integer("account_level_id").unsigned();
        table.foreign("account_level_id").references("account_levels.id");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("companies");
}
