import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.text("first_name").notNullable();
        table.text("last_name").notNullable();
        table.string("gender");
        table.bigInteger("phone");
        table.date("birthday");
        table.integer("city_id").unsigned();
        table.foreign("city_id").references("cities.id");
        table.text("address");
        table.text("avatar");
        table.text("banner");
        table.text("headline");
        table.integer("company_name_id").unsigned();
        table.foreign("company_name_id").references("company_names.id");
        table.integer("industry_id").unsigned();
        table.foreign("industry_id").references("industries.id");
        table.text("introduction");
        table.integer("education_id").unsigned();
        table.foreign("education_id").references("education.id");
        table.integer("experience");
        table.text("website");
        table.integer("role_id").unsigned();
        table.foreign("role_id").references("user_roles.id");
        table.boolean("is_verified").defaultTo(false);
        table.boolean("is_activated").defaultTo(true);
        table.boolean("is_admin").defaultTo(false);
        table.timestamps(false, true);
        table.text("resume");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("users");
}
