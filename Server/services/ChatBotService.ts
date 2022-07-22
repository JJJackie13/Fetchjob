import { Knex } from "knex";
import { logger } from "../logger";

export class ChatBotService {
    constructor(private knex: Knex) {}
    getJobSearchRes = async (
        userId: number,
        IndustryQuery: string,
        educationQuery: number,
        annualLeaveQuery: number,
        employmentTypesQuery: string
    ) => {
        try {
            console.log("getJobSearchRes START");
            console.log(
                "userId",
                userId,
                "IndustryQuery",
                IndustryQuery,
                "educationQuery",
                educationQuery,
                "annualLeaveQuery",
                annualLeaveQuery,
                "employmentTypesQuery",
                employmentTypesQuery
            );
            // let industryQueryStr = `i.name ilike '%${IndustryQuery}%'`;
            // let educationQueryStr = `${
            //     educationQuery ? `and education.id <= ${educationQuery}` : ""
            // }`;
            // let annualLeaveQueryStr = `${annualLeaveQuery} <= j.annual_leave`;
            // let employmentTypesQueryStr = `employment_types.name ilike '%${employmentTypesQuery}%'`;

            let results = (
                await this.knex.raw(`
                select distinct j.id as job_id, job_title, job_detail,
                cn.name as company_name, c.avatar, cities.name as city_name,
                countries.name as country_name, i.name as industry,
                j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, auto_delist,
                (select sj.id where sj.user_id = ${userId} and sj.job_id = j.id) as bookmark_id,
                (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                from jobs as j
                join companies as c on c.id = j.company_id
                join industries as i on i.id = c.industry_id
                join company_names as cn on cn.id = c.name_id
                join cities on cities.id = j.city_id
                join countries on cities.country_id = countries.id
                join saved_jobs AS sj ON j.id = sj.job_id
                join job_employment_type on job_employment_type.job_id = j.id
                join employment_types on employment_types.id = job_employment_type.type_id
                join education on education.id = j.education_requirement_id
                where i.name ilike '%${IndustryQuery}%'
                ${educationQuery ? `and education.id <= ${educationQuery}` : ""}
                and ${annualLeaveQuery} <= j.annual_leave
                and employment_types.name ilike '%${employmentTypesQuery}%'
                limit 2
                    `)
            ).rows;

            if (results.length === 0) {
                results = (
                    await this.knex.raw(`
                    select distinct j.id as job_id, job_title, job_detail,
                    cn.name as company_name, c.avatar, cities.name as city_name,
                    countries.name as country_name, i.name as industry,
                    j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, auto_delist,
                    (select sj.id where sj.user_id = ${userId} and sj.job_id = j.id) as bookmark_id,
                    (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                    from jobs as j
                    join companies as c on c.id = j.company_id
                    join industries as i on i.id = c.industry_id
                    join company_names as cn on cn.id = c.name_id
                    join cities on cities.id = j.city_id
                    join countries on cities.country_id = countries.id
                    join saved_jobs AS sj ON j.id = sj.job_id
                    join job_employment_type on job_employment_type.job_id = j.id
                    join employment_types on employment_types.id = job_employment_type.type_id
                    join education on education.id = j.education_requirement_id
                    where i.name ilike '%${IndustryQuery}%'
                    ${
                        educationQuery
                            ? `and education.id <= ${educationQuery}`
                            : ""
                    }
                    and ${annualLeaveQuery - 5} <= j.annual_leave
                    limit 2
                        `)
                ).rows;
            }
            console.log("getJobSearchRes", results);
            return results;
        } catch (error) {
            console.log("getStaffSearchRes", error);
            logger.error("error", JSON.stringify(error));
            return false;
        }
    };
    getStaffSearchRes = async (
        education: number,
        industry: string,
        experience: number
    ) => {
        try {
            // console.log(
            //     "FIND STAFF START NOW | All elements: ",
            //     educationLevel,
            //     industry,
            //     experience
            // );

            let results = (
                await this.knex.raw(`
                select 
                users.id,
                users.first_name,
                users.last_name,
                users.headline,
                users.avatar,
                users.banner,
                cn.name as company_name
                from users
                join company_names as cn on users.company_name_id = cn.id
                join industries on users.industry_id = industries.id
                join education on users.education_id = education.id
                where industries.name ilike '%${industry}%'
                ${education ? `and education.id <= ${education}` : ""}
                and users.experience >= ${experience}
                order by random()
                limit 2
                    `)
            ).rows;
            if (results.length === 0) {
                results = (
                    await this.knex.raw(`
                    select 
                    users.id,
                    users.first_name,
                    users.last_name,
                    users.headline,
                    users.avatar,
                    users.banner,
                    cn.name as company_name
                    from users
                    join company_names as cn on users.company_name_id = cn.id
                    join industries on users.industry_id = industries.id
                    join education on users.education_id = education.id
                    where industries.name ilike '%${industry}%'
                    ${education ? `and education.id <= ${education}` : ""}
                    and users.experience >= ${experience - 2}
                    order by random()
                    limit 2
                        `)
                ).rows;
            }
            console.log("getStaffSearchRes", results);
            return results;
        } catch (error) {
            console.log("getStaffSearchRes", error);
            logger.error("error", error);
            return { err: "System error" };
        }
    };
}
