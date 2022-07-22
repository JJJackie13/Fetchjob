import { Knex } from "knex";

export class OptionService {
    constructor(private knex: Knex) {}
    getAllLocations = async () => {
        try {
            const cities = await this.knex("cities")
                .join("countries", "cities.country_id", "countries.id")
                .select(
                    "cities.id",
                    "cities.name",
                    "cities.country_id",
                    "countries.name as country"
                )
                .orderBy("cities.name");
            const countries = await this.knex("countries")
                .select("*")
                .orderBy("name");
            return { cities, countries };
        } catch (error) {
            return false;
        }
    };
    getAllEducations = async () => {
        try {
            const education = await this.knex("education").select("id", "name");
            return { education };
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    getAllIndustries = async () => {
        try {
            const industries = await this.knex("industries")
                .select("id", "name")
                .orderBy("name");
            return { industries };
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    getAllCompanyTypes = async () => {
        try {
            const companyTypes = await this.knex("company_types").select(
                "id",
                "name"
            );
            return { companyTypes };
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    getAllEmploymentTypes = async () => {
        try {
            const employmentTypes = await this.knex("employment_types").select(
                "id",
                "name"
            );
            return { employmentTypes };
        } catch (error) {
            console.log("getAllEmploymentTypes", error);
            return false;
        }
    };
    getAllCommenterTypes = async () => {
        try {
            const commenterTypes = await this.knex("commenter_types").select(
                "id",
                "name"
            );
            return { commenterTypes };
        } catch (error) {
            console.log("getAllCommenterTypes", error);
            return false;
        }
    };
    getAllControlLevels = async () => {
        try {
            const controlLevels = await this.knex("control_levels").select(
                "id",
                "level",
                "name"
            );
            return controlLevels;
        } catch (error) {
            return false;
        }
    };
    getAllReportTypes = async () => {
        const reportTypes = await this.knex("report_types").select(
            "id",
            "name"
        );
        return { data: reportTypes };
    };
    getAllPostReportTypes = async () => {
        const PostReportTypes = await this.knex("post_report_types").select(
            "id",
            "name"
        );
        return { data: PostReportTypes };
    };
}
