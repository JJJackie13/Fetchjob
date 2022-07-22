import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("jobs", (table) => {
        table.increments();
        table.integer("company_id").unsigned();
        table.foreign("company_id").references("companies.id");
        table.text("job_title");
        table.text("job_detail");
        table.integer("city_id").unsigned();
        table.foreign("city_id").references("cities.id");
        table.integer("education_requirement_id").unsigned();
        table.foreign("education_requirement_id").references("education.id");
        table.integer("experience_requirement");
        table.integer("annual_leave");
        table.text("contact_person");
        table.string("contact_email");
        table.bigInteger("contact_phone");
        table.date("auto_delist");
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("jobs");
}
