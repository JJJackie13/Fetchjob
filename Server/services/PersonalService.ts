import { Knex } from "knex";
// import fs from "fs";
// import path from "path";

export class PersonalService {
    constructor(private knex: Knex) {}

    getPersonalById = async (id: number) => {
        // console.log("id = ", id);

        const personal = (
            await this.knex.raw(`select * from users
             where id = ${id}`)
        ).rows[0];
        return personal;
    };

    editPersonal = async (userId: number, body: any) => {
        try {
            const {
                first_name,
                last_name,
                gender,
                phone,
                birthday,
                headline,
                company_name,
                industry,
                introduction,
                education_id,
                experience,
                website,
            } = body;

            await this.knex("users")
                .update({
                    first_name,
                    last_name,
                    gender,
                    phone,
                    birthday,
                    headline,
                    company_name,
                    industry,
                    introduction,
                    education_id,
                    experience,
                    website,
                    updated_at: new Date(),
                })
                .where("id", userId);

            return { success: true, message: "Updated successfully" };
        } catch (error) {
            return { success: false, message: "Failed to update" };
        }
    };
}
