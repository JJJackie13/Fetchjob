import { Knex } from "knex";
import { logger } from "../logger";

export class SearchService {
    constructor(private knex: Knex) {}
    getCompSearchRes = async (key: string) => {
        try {
            if (key == "") {
                const results = await this.knex
                    .raw(`select company_names.name, companies.id, companies.avatar,
                industries.name as industName, companies.introduction 
                from companies
                join industries on industries.id = companies.industry_id
                join company_names on companies.name_id = company_names.id;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select distinct company_names.name, companies.id, companies.avatar,
                industries.name as industName, companies.introduction 
                from companies
                join industries on industries.id = companies.industry_id
                join company_names on companies.name_id = company_names.id 
                where UPPER(company_names.name) like UPPER('%${key}%');`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error", error);
            return { err: "System error" };
        }
    };
    getCompSearchResLimit = async (key: string) => {
        try {
            if (key == "") {
                const results = await this.knex
                    .raw(`select distinct company_names.name as company_name, c.id, c.avatar,
                industries.name as industry, c.introduction, c.banner, c.business_size, c.is_verified,
                cities.name as city, countries.name as country
                from companies as c
                join industries on industries.id = c.industry_id
                join company_names on c.name_id = company_names.id
                join cities on cities.id = c.city_id
                join countries on cities.country_id = countries.id
                limit 3;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select distinct company_names.name as company_name, c.id, c.avatar,
                industries.name as industry, c.introduction, c.banner, c.business_size, c.is_verified,
                cities.name as city, countries.name as country
                from companies as c
                join industries on industries.id = c.industry_id
                join company_names on c.name_id = company_names.id
                join cities on cities.id = c.city_id
                join countries on cities.country_id = countries.id
                where UPPER(company_names.name) like UPPER('${key}%')
                limit 3;`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error", error);
            return { err: "System error" };
        }
    };
    getJobSearchRes = async (key: string) => {
        try {
            if (key == "") {
                const results = await this.knex
                    .raw(`select distinct on (j.id) j.id as job_id, job_title, job_detail,
                cn.name as company_name, c.avatar, cities.name as city_name,
                countries.name as country_name, i.name as industry, auto_delist,
                j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, experience_requirement
                from jobs as j
                join companies as c on c.id = j.company_id
                join industries as i on i.id = c.industry_id
                join company_names as cn on cn.id = c.name_id
                join cities on cities.id = j.city_id
                join countries on cities.country_id = countries.id`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select distinct on (j.id) j.id as job_id, job_title, job_detail,
                cn.name as company_name, c.avatar, cities.name as city_name,
                countries.name as country_name, i.name as industry, auto_delist,
                j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, experience_requirement
                from jobs as j
                join companies as c on c.id = j.company_id
                join industries as i on i.id = c.industry_id
                join company_names as cn on cn.id = c.name_id
                join cities on cities.id = j.city_id
                join countries on cities.country_id = countries.id
                where UPPER(job_title) like UPPER('%${key}%');`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error", JSON.stringify(error));
            return { err: "System error" };
        }
    };
    getJobSearchResLimit = async (key: string) => {
        try {
            if (key == "") {
                const results = await this.knex
                    .raw(`select distinct on (j.id) j.id as job_id, job_title, job_detail,
                cn.name as company_name, c.avatar, cities.name as city_name,
                countries.name as country_name, i.name as industry, auto_delist,
                j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size,
                (select sj.id where sj.user_id = 13 and sj.job_id = j.id) as bookmark_id,
                (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                from jobs as js
                join companies as c on c.id = j.company_id
                join industries as i on i.id = c.industry_id
                join company_names as cn on cn.id = c.name_id
                join cities on cities.id = j.city_id
                join countries on cities.country_id = countries.id
                JOIN saved_jobs AS sj ON j.id = sj.job_id
                limit 3;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select distinct on (j.id) j.id as job_id, job_title, job_detail,
                cn.name as company_name, c.avatar, cities.name as city_name,
                countries.name as country_name, i.name as industry, auto_delist,
                j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size,
                (select sj.id where sj.user_id = 13 and sj.job_id = j.id) as bookmark_id,
                (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                from jobs as j
                join companies as c on c.id = j.company_id
                join industries as i on i.id = c.industry_id
                join company_names as cn on cn.id = c.name_id
                join cities on cities.id = j.city_id
                join countries on cities.country_id = countries.id
                JOIN saved_jobs AS sj ON j.id = sj.job_id
                where UPPER(job_title) like UPPER('%${key}%')
                limit 3;`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error", JSON.stringify(error));
            return { err: "System error" };
        }
    };
    getUserSearchRes = async (key: string) => {
        try {
            if (key == "") {
                const results = await this.knex
                    .raw(`select *, u.id as user_id, i.name as industry, company_names.name as company_name
                from users as u
                join company_names on users.company_name_id = company_names.id
                join industries as i on u.industry_id = i.id
                join cities on cities.id = u.city_id
                join countries on cities.country_id = countries.id;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select users.first_name, users.last_name, users.avatar,
                industries.name as industName, users.headline, users.introduction, users.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                where UPPER(users.first_name) like UPPER('%${key}%')
                or UPPER(users.last_name) like UPPER('%${key}%')
                or UPPER(industries.name) like UPPER('%${key}%')
                or UPPER(company_names.name) like UPPER('%${key}%');`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error", error);
            return { err: "System error" };
        }
    };
    getUserSearchResLimit = async (key: string) => {
        try {
            if (key == "") {
                const results = await this.knex
                    .raw(`select u.first_name, u.last_name, u.banner, u.avatar, u.headline,
                u.introduction, u.id as counterpart_id, i.name as industry, company_names.name as company_name,
                cities.name as city, countries.name as country
                from users as u
                join company_names on u.company_name_id = company_names.id
                join industries as i on u.industry_id = i.id
                join cities on u.city_id = cities.id 
                join countries on cities.country_id = countries.id
                limit 3;`);
                return { success: true, data: results.rows };
            } else {
                const results = (await this.knex
                    .raw(`select u.first_name, u.last_name, u.banner, u.avatar, u.headline,
                u.introduction, u.id as counterpart_id, i.name as industry, company_names.name as company_name,
                cities.name as city, countries.name as country
                from users as u
                join company_names on u.company_name_id = company_names.id
                join industries as i on u.industry_id = i.id
                join cities on u.city_id = cities.id 
                join countries on cities.country_id = countries.id
                where UPPER(concat(first_name, ' ', last_name)) like UPPER('%${key}%')
                limit 3;`)
                ).rows;
                return { success: true, data: results };
            }
        } catch (error) {
            logger.error("error", error);
            return { err: "System error" };
        }
    };
    getIndustryCB = async (key: string) => {
        try {
            if (key == "all") {
                const results = await this.knex
                    .raw(`select count(industries.name), industries.name, industries.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                group by industries.name, industries.id
                order by count(industries.name) desc;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select count(industries.name), industries.name, industries.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                where UPPER(users.first_name) like UPPER('%${key}%')
                or UPPER(users.last_name) like UPPER('%${key}%')
                or UPPER(industries.name) like UPPER('%${key}%')
                or UPPER(company_names.name) like UPPER('%${key}%')
                group by industries.name, industries.id
                order by count(industries.name) desc;`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getLocationCB = async (key: string) => {
        try {
            if (key == "all") {
                const results = await this.knex
                    .raw(`select count(cities.name), cities.name as location, cities.id
                    from users
                    join company_names on users.company_name_id = company_names.id
                    join industries on users.industry_id = industries.id
                    join companies on company_names.id = companies.name_id
                    join cities on cities.id = companies.city_id
                    group by cities.name, cities.id
                    order by count(cities.name) desc;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select count(cities.name), cities.name as location, cities.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                join companies on company_names.id = companies.name_id
                join cities on cities.id = companies.city_id
                where UPPER(users.first_name) like UPPER('%${key}%')
                or UPPER(users.last_name) like UPPER('%${key}%')
                or UPPER(industries.name) like UPPER('%${key}%')
                or UPPER(company_names.name) like UPPER('%${key}%')
                group by cities.name, cities.id
                order by count(cities.name) desc;`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getCompanyCB = async (key: string) => {
        try {
            if (key == "all") {
                const results = await this.knex
                    .raw(`select count(company_names.name), company_names.name, companies.id
                    from users
                    join company_names on users.company_name_id = company_names.id
                    join industries on users.industry_id = industries.id
                    join companies on company_names.id = companies.name_id
                    group by company_names.name, companies.id
                    order by count(company_names.name) desc;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select count(company_names.name), company_names.name, companies.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                join companies on company_names.id = companies.name_id
                where UPPER(users.first_name) like UPPER('%${key}%')
                or UPPER(users.last_name) like UPPER('%${key}%')
                or UPPER(industries.name) like UPPER('%${key}%')
                or UPPER(company_names.name) like UPPER('%${key}%')
                group by company_names.name, companies.id
                order by count(company_names.name) desc;`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getIndustryListRes = async (key: any, industries: any) => {
        try {
            console.log("keys = ", key, industries);
            if (key == "all") {
                const results = await this.knex
                    .raw(`select count(industries.name), industries.name, industries.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                where UPPER(industries.name) like UPPER('%${industries}%') 
                group by industries.name, industries.id
                order by count(industries.name) desc;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select count(industries.name), industries.name, industries.id
                    from users
                    join company_names on users.company_name_id = company_names.id
                    join industries on users.industry_id = industries.id
                    where ( UPPER(users.first_name) like UPPER('%${key}%') and UPPER(industries.name) like UPPER('%${industries}%') )
                    or ( UPPER(users.last_name) like UPPER('%${key}%') and UPPER(industries.name) like UPPER('%${industries}%') )
                    or ( UPPER(industries.name) like UPPER('%${key}%') and UPPER(industries.name) like UPPER('%${industries}%') )
                    or ( UPPER(company_names.name) like UPPER('%${key}%') and UPPER(industries.name) like UPPER('%${industries}%') )
                    group by industries.name, industries.id
                    order by count(industries.name) desc;`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getNewIndustryListRes = async (id: string) => {
        try {
            console.log("NewCB id = ", id);
            const result = await this.knex
                .raw(`select count(industries.name), industries.name, industries.id
            from users
            join company_names on users.company_name_id = company_names.id
            join industries on users.industry_id = industries.id
            where industries.id = ${id}
            group by industries.name, industries.id
            order by count(industries.name) desc;`);
            return { success: true, data: result.rows };
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getLocationListRes = async (key: any, location: any) => {
        try {
            console.log("location keys = ", key, location);
            if (key == "all") {
                const results = await this.knex
                    .raw(`select count(cities.name), cities.name as location, cities.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                join companies on industries.id = companies.name_id
                join cities on cities.id = companies.city_id
                where UPPER(cities.name) like UPPER('%${location}%')
                group by cities.name, cities.id
                order by count(cities.name) desc;`);
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select count(cities.name), cities.name as location, cities.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                join companies on industries.id = companies.name_id
                join cities on cities.id = companies.city_id
                where ( UPPER(users.first_name) like UPPER('%${key}%') and UPPER(cities.name) like UPPER('%${location}%') )
                or ( UPPER(users.last_name) like UPPER('%${key}%') and UPPER(cities.name) like UPPER('%${location}%') )
                or ( UPPER(industries.name) like UPPER('%${key}%') and UPPER(cities.name) like UPPER('%${location}%') )
                or ( UPPER(company_names.name) like UPPER('%${key}%') and UPPER(cities.name) like UPPER('%${location}%') )
                group by cities.name, cities.id
                order by count(cities.name) desc;`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getNewLocationListRes = async (id: string) => {
        try {
            console.log("NewCB id = ", id);
            const result = await this.knex
                .raw(`select count(cities.name), cities.name as location, cities.id
            from users
            join company_names on users.company_name_id = company_names.id
            join industries on users.industry_id = industries.id
            join companies on industries.id = companies.name_id
            join cities on cities.id = companies.city_id
            where companies.id = ${id}
            group by cities.name, cities.id
            order by count(cities.name) desc;`);
            return { success: true, data: result.rows };
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getCompanyListRes = async (key: any, companies: any) => {
        try {
            console.log("location keys = ", key, companies);
            if (key == "all") {
                const results = await this.knex
                    .raw(`select count(company_names.name), company_names.name, companies.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                join companies on industries.id = companies.name_id
                where UPPER(company_names.name) like UPPER('%${companies}%')
                group by company_names.name, companies.id
                order by count(company_names.name) desc;`);
                console.log("What is the searchCompList???", results.rows)
                return { success: true, data: results.rows };
            } else {
                const results = await this.knex
                    .raw(`select count(company_names.name), company_names.name, companies.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                join companies on industries.id = companies.name_id
                where ( UPPER(users.first_name) like UPPER('%${key}%') and UPPER(company_names.name) like UPPER('%${companies}%') )
                or ( UPPER(users.last_name) like UPPER('%${key}%') and UPPER(company_names.name) like UPPER('%${companies}%'))
                or ( UPPER(industries.name) like UPPER('%${key}%') and UPPER(company_names.name) like UPPER('%${companies}%') )
                or ( UPPER(company_names.name) like UPPER('%${key}%') and UPPER(company_names.name) like UPPER('%${companies}%') )
                group by company_names.name, companies.id
                order by count(company_names.name) desc;`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getNewCompanyListRes = async (id: string) => {
        try {
            console.log("NewCB id = ", id);
            const result = await this.knex
                .raw(`select count(company_names.name), company_names.name, companies.id
            from users
            join company_names on users.company_name_id = company_names.id
            join industries on users.industry_id = industries.id
            join companies on industries.id = companies.name_id
            where companies.id = ${id}
            group by company_names.name, companies.id
            order by count(company_names.name) desc;`);
            console.log("What is the addCompList???", result.rows)
            return { success: true, data: result.rows };
        } catch (error) {
            logger.error("error:", error);
            return { err: "System error" };
        }
    };
    getUserFilterSearchRes = async (
        key: any,
        industry: any,
        location: any,
        company: any
    ) => {
        try {
            console.log("All elements: ", key, industry, location, company);
            if (key == "all") {
                let iConnectionClause = industry ? "where" : "";
                let lConnectionClause = location ? "and" : "";
                let cConnectionClause = company ? "and" : "";
                let industryClause = industry ? `industries.id in (${industry})` : "";
                let locationClause = location ? `cities.id in (${location})` : "";
                let companyClause = company ? `companies.id in (${company})` : "";
                if (!industry && location && company) {
                    lConnectionClause = "where";
                }
                if (!industry && !location && company) {
                    cConnectionClause = "where";
                }
                const results = await this.knex
                    .raw(`select users.first_name, users.last_name, users.avatar, industries.id,
                industries.name as industName, users.headline, users.introduction, users.id
                from users
                join company_names on users.company_name_id = company_names.id
                join industries on users.industry_id = industries.id
                join companies on company_names.id = companies.name_id
                join cities on cities.id = companies.city_id
                ${iConnectionClause} ${industryClause} ${lConnectionClause} ${locationClause} ${cConnectionClause} ${companyClause};`);
                return { success: true, data: results.rows };
            } else {
                let iConnectionClause = industry ? "and" : "";
                let lConnectionClause = location ? "and" : "";
                let cConnectionClause = company ? "and" : "";
                let industryClause = industry ? `industries.id in (${industry})` : "";
                let locationClause = location ? `companies.id in (${location})` : "";
                let companyClause = company ? `companies.id in (${company})` : "";

                const results = await this.knex
                    .raw(`select users.first_name, users.last_name, users.avatar, industries.id,
                industries.name as industName, users.headline, users.introduction, users.id
                from users
                join company_names on users.company_names_id = company_names.id
                join industries on users.industry_id = industries.id
                join companies on company_names.id = companies.name_id
                join cities on cities.id = companies.city_id
                where ( UPPER(users.first_name) like UPPER('%${key}%')
                or UPPER(users.last_name) like UPPER('%${key}%')
                or UPPER(industries.name) like UPPER('%${key}%')
                or UPPER(company_names.name) like UPPER('%${key}%') )
                ${iConnectionClause} ${industryClause} ${lConnectionClause} ${locationClause} ${cConnectionClause} ${companyClause};`);
                return { success: true, data: results.rows };
            }
        } catch (error) {
            logger.error("error", error);
            return { err: "System error" };
        }
    };
}
