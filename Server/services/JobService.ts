import { Knex } from "knex";
import { logger } from "../logger";

interface JobSubmit {
    company_id: number;
    job_title: string;
    job_detail: string;
    location: string;
    education_requirement: number;
    experience_requirement: number;
    career_level: string;
    annual_leave: number;
    contact_person: string;
    contact_email: string;
    contact_phone: number;
}

export class JobService {
    constructor(private knex: Knex) {}
    getAllJobs = async () => {
        try {
            const result = await this.knex("jobs")
                .join("companies", "jobs.company_id", "companies.id")
                .select("*");
            return { success: true, data: result };
        } catch (error) {
            logger.error(error);
            return { success: false };
        }
    };
    postJob = async (data: JobSubmit) => {
        try {
            await this.knex("jobs").insert(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error };
        }
    };
    editJob = async (id: number, data: JobSubmit) => {
        try {
            await this.knex("jobs").where("id", id).update(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error };
        }
    };
    deleteJob = async (id: number) => {
        try {
            await this.knex("jobs").where("id", id).del();
            return { success: true };
        } catch (error) {
            return { success: false, message: error };
        }
    };
    getSavedJobs = async (userId: number) => {
        try {
            // const result = await this.knex("saved_jobs")
            //     .join("jobs", "saved_jobs.job_id", "jobs.id")
            //     .join("companies", "companies.id", "jobs.company_id")
            //     .join("company_name", "companies.name", "company_name.id")
            //     .where("saved_jobs.user_id", userId)
            //     .select("*");
            // .select("job_id", "job_title", "location");

            // const result = (
            //     await this.knex.raw(
            //         `select j.id as job_id, job_title, job_detail,
            //         cn.name as company_name, c.avatar, cities.name as city_name,
            //         countries.name as country_name, i.name as industry,
            //         j.created_at as post_date, sj.id as bookmark_id,
            //         j.updated_at as update_date, annual_leave, business_size, auto_delist,
            //         c.banner, ed.name as education, et.name as employment_type,
            //         annual_leave, business_size
            //         from jobs as j
            //         join saved_jobs as sj on j.id = sj.job_id
            //         join companies as c on c.id = j.company_id
            //         join industries as i on i.id = c.industry_id
            //         join company_names as cn on cn.id = c.name_id
            //         join cities on cities.id = j.city_id
            //         join countries on cities.country_id = countries.id
            //         left join education as ed on j.education_requirement_id = ed.id
            //         left join job_employment_type as jet on jet.job_id = j.id
            //         left join employment_types as et on et.id = jet.type_id
            //         where sj.user_id = :userId;`,
            //         { userId }
            //     )
            // ).rows;
            const result = (
                await this.knex.raw(
                    `select j.id as job_id, job_title, job_detail,
                    cn.name as company_name, c.avatar, cities.name as city_name,
                    countries.name as country_name, i.name as industry,
                    j.created_at as post_date, sj.id as bookmark_id,
                    j.updated_at as update_date, annual_leave, business_size, auto_delist,
                    c.banner, ed.name as education, 
                    (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                    from jobs as j
                    join saved_jobs as sj on j.id = sj.job_id
                    join companies as c on c.id = j.company_id
                    join industries as i on i.id = c.industry_id
                    join company_names as cn on cn.id = c.name_id
                    join cities on cities.id = j.city_id
                    join countries on cities.country_id = countries.id
                    left join education as ed on j.education_requirement_id = ed.id
                    left join job_employment_type as jet on jet.job_id = j.id
                    left join employment_types as et on et.id = jet.type_id
                    where sj.user_id = :userId;`,
                    { userId }
                )
            ).rows;

            return { success: true, data: result };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    };
    getAllJobsByCompany = async (userId: number, companyId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    `
                    select j.id as job_id, c.id as company_id, job_title, job_detail,
                    cn.name as company_name, c.avatar, cities.name as city_name,
                    countries.name as country_name, i.name as industry,
                    j.created_at as post_date,
                    (select sj.id from saved_jobs sj where sj.user_id = :userId and sj.job_id = j.id) as bookmark_id,
                    (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type,
                    j.updated_at as update_date, annual_leave, business_size, auto_delist,
                    c.banner, ed.name as education,
                    annual_leave, 
                    business_size
                    from jobs as j
                    join companies as c on c.id = j.company_id
                    left join industries as i on i.id = c.industry_id
                    join company_names as cn on cn.id = c.name_id
                    join cities on cities.id = j.city_id
                    join countries on cities.country_id = countries.id
                    left join education as ed on j.education_requirement_id = ed.id
                    where j.company_id = :companyId
                    order by j.created_at desc;
                    `,
                    { userId, companyId }
                )
            ).rows;
            // console.log(result);
            return result;
        } catch (error) {
            console.log("getAllJobsByCompany", error);
            return false;
        }
    };
    getRandomJob = async (userId: any, jobId: number) => {
        try {
            const userIndustryId = (
                await this.knex.raw(
                    `select *
                from jobs as j
                join companies as c on c.id = j.company_id
                join industries as i on i.id = c.industry_id
                where j.id = :jobId`,
                    {
                        jobId,
                    }
                )
            ).rows[0]["industry_id"];
            console.log("industry_id", userIndustryId);
            const result = (
                await this.knex.raw(
                    `select distinct on (j.id) j.id as job_id, job_title, job_detail,
                    cn.name as company_name, c.avatar, cities.name as city_name,
                    countries.name as country_name, i.name as industry,
                    j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, auto_delist,
                    (select sj.id where sj.user_id = :userId and sj.job_id = j.id) as bookmark_id,
                    (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                    from jobs as j
                    join companies as c on c.id = j.company_id
                    join industries as i on i.id = c.industry_id
                    join company_names as cn on cn.id = c.name_id
                    join cities on cities.id = j.city_id
                    join countries on cities.country_id = countries.id
                    join saved_jobs AS sj ON j.id = sj.job_id
                    where i.id = :userIndustryId
                    order by j.id, random() limit 10;`,
                    { userId, userIndustryId }
                )
            ).rows;
            console.log("getRecommendedJobs", result);
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
    getJobById = async (jobId: number) => {
        try {
            const result = (await this.knex("jobs").select("id", jobId))[0];
            const employmentTypes = await this.knex(
                "job_employment_type as jet"
            )
                .join("employment_types as et", "et.id", "jet.job_id")
                .select("*")
                .where("jet.job_id", jobId);
            return { data: result, employmentTypes: employmentTypes };
        } catch (error) {
            return false;
        }
    };
    getRecommendedJobs = async (userId: number) => {
        try {
            const userIndustryId = (
                await this.knex.raw("select * from users where id = :userId", {
                    userId,
                })
            ).rows[0]["industry_id"];
            console.log("industry_id", userIndustryId);
            const result = (
                await this.knex.raw(
                    `select distinct on (j.id)j.id as job_id, job_title, job_detail,
                    cn.name as company_name, c.avatar, cities.name as city_name,
                    countries.name as country_name, i.name as industry,
                    j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, auto_delist,
                    (select sj.id where sj.user_id = :userId and sj.job_id = j.id) as bookmark_id,
                    (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                    from jobs as j
                    join companies as c on c.id = j.company_id
                    join industries as i on i.id = c.industry_id
                    join company_names as cn on cn.id = c.name_id
                    join cities on cities.id = j.city_id
                    join countries on cities.country_id = countries.id
                    join saved_jobs AS sj ON j.id = sj.job_id
                    where i.id = :userIndustryId
                    order by j.id desc limit 3;`,
                    { userId, userIndustryId }
                )
            ).rows;
            // console.log("getRecommendedJobs", result);
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
    getAllRecommendedJobs = async (userId: number) => {
        try {
            const userIndustryId = (
                await this.knex.raw("select * from users where id = :userId", {
                    userId,
                })
            ).rows[0]["industry_id"];
            console.log("industry_id", userIndustryId);
            const result = (
                await this.knex.raw(
                    `select j.id as job_id, job_title, job_detail,
                    cn.name as company_name, c.avatar, cities.name as city_name,
                    countries.name as country_name, i.name as industry,
                    j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, auto_delist,
                    (select sj.id where sj.user_id = :userId and sj.job_id = j.id) as bookmark_id,
                    (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                    from jobs as j
                    join companies as c on c.id = j.company_id
                    join industries as i on i.id = c.industry_id
                    join company_names as cn on cn.id = c.name_id
                    join cities on cities.id = j.city_id
                    join countries on cities.country_id = countries.id
                    JOIN saved_jobs AS sj ON j.id = sj.job_id
                    where i.id = :userIndustryId
                    order by j.id desc;`,
                    { userId, userIndustryId }
                )
            ).rows;
            // console.log("getRecommendedJobs", result);
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
    getRecommendedJobsbyExp = async (userId: number) => {
        try {
            const userIndustryId = (
                await this.knex.raw("select * from users where id = :userId", {
                    userId,
                })
            ).rows[0]["industry_id"];
            const userExp = (
                await this.knex.raw("select * from users where id = :userId", {
                    userId,
                })
            ).rows[0]["experience"];
            const result = (
                await this.knex.raw(
                    `select distinct on (j.id)j.id as job_id, job_title, job_detail,
                    cn.name as company_name, c.avatar, cities.name as city_name,
                    countries.name as country_name, i.name as industry, auto_delist,
                    j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, experience_requirement,
                    (select sj.id where sj.user_id = :userId and sj.job_id = j.id) as bookmark_id,
                    (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                    from jobs as j
                    join companies as c on c.id = j.company_id
                    join industries as i on i.id = c.industry_id
                    join company_names as cn on cn.id = c.name_id
                    join cities on cities.id = j.city_id
                    join countries on cities.country_id = countries.id
                    JOIN saved_jobs AS sj ON j.id = sj.job_id
                    where j.experience_requirement between :userExp and (:userExp + 2)
                    and i.id = :userIndustryId
                    order by j.id desc limit 3;`,
                    { userId, userExp, userIndustryId }
                )
            ).rows;
            // console.log("getRecommendedJobsbyExp", result);
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
    getAllRecommendedJobsbyExp = async (userId: number) => {
        try {
            const userIndustryId = (
                await this.knex.raw("select * from users where id = :userId", {
                    userId,
                })
            ).rows[0]["industry_id"];
            const userExp = (
                await this.knex.raw("select * from users where id = :userId", {
                    userId,
                })
            ).rows[0]["experience"];
            const result = (
                await this.knex.raw(
                    `select j.id as job_id, job_title, job_detail,
                    cn.name as company_name, c.avatar, cities.name as city_name,
                    countries.name as country_name, i.name as industry, auto_delist,
                    j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, experience_requirement,
                    (select sj.id where sj.user_id = :userId and sj.job_id = j.id) as bookmark_id,
                    (select array(select name from job_employment_type jet join employment_types et on et.id = jet.type_id where jet.job_id = j.id)) as employment_type
                    from jobs as j
                    join companies as c on c.id = j.company_id
                    join industries as i on i.id = c.industry_id
                    join company_names as cn on cn.id = c.name_id
                    join cities on cities.id = j.city_id
                    join countries on cities.country_id = countries.id
                    JOIN saved_jobs AS sj ON j.id = sj.job_id
                    where j.experience_requirement between :userExp and (:userExp + 2)
                    and i.id = :userIndustryId
                    order by j.id desc;`,
                    { userId, userExp, userIndustryId }
                )
            ).rows;
            // console.log("getRecommendedJobsbyExp", result);
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
    bookmarkJob = async (userId: number, jobId: number) => {
        try {
            const isBookmark =
                (
                    await this.knex("saved_jobs")
                        .select("*")
                        .where("user_id", userId)
                        .andWhere("job_id", jobId)
                ).length > 0;
            if (isBookmark) {
                await this.knex("saved_jobs")
                    .where("user_id", userId)
                    .andWhere("job_id", jobId)
                    .del();
            } else {
                await this.knex("saved_jobs").insert({
                    user_id: userId,
                    job_id: jobId,
                });
            }
            return true;
        } catch (error) {
            console.log("addSavedJob service=>", error);
            return false;
        }
    };
    removeSavedJob = async (userId: number, jobId: number) => {
        try {
            await this.knex.raw(
                "delete from saved_jobs where user_id = :userId and job_id = :jobId",
                { userId, jobId }
            );
            return { success: true };
        } catch (error) {
            console.log("removeSavedJob service=>", error);
            return { success: false };
        }
    };
    getAllEducationRequirements = async () => {
        try {
            const data = (await this.knex.raw("select * from education")).rows;
            return { success: true, data };
        } catch (error) {
            console.log("getAllEducationRequirements service=>", error);
            return { success: false };
        }
    };
    postNewJob = async (companyId: number, data: any) => {
        const {
            job_title,
            job_detail,
            city_id,
            education_requirement_id,
            experience_requirement,
            annual_leave,
            contact_person,
            contact_email,
            contact_phone,
            auto_delist,
            job_employment_type,
        } = data;
        try {
            await this.knex.transaction(async (trx) => {
                const id = (
                    await trx("jobs")
                        .insert({
                            company_id: companyId,
                            job_title,
                            job_detail,
                            city_id,
                            education_requirement_id,
                            experience_requirement,
                            annual_leave,
                            contact_person,
                            contact_email,
                            contact_phone,
                            auto_delist,
                        })
                        .returning("id")
                )[0];
                // console.log("id", id);
                await trx("job_employment_type").insert(
                    job_employment_type.map((obj: any) => {
                        return { job_id: id, type_id: obj.id };
                    })
                );
            });
            return true;
        } catch (error) {
            console.log("postNewJob", error);
            return false;
        }
    };
    EditJob = async (jobId: number, data: any) => {
        const {
            job_title,
            job_detail,
            city_id,
            education_requirement_id,
            experience_requirement,
            annual_leave,
            contact_person,
            contact_email,
            contact_phone,
            auto_delist,
            job_employment_type,
        } = data;
        try {
            await this.knex.transaction(async (trx) => {
                await trx("jobs")
                    .update({
                        job_title,
                        job_detail,
                        city_id,
                        education_requirement_id,
                        experience_requirement,
                        annual_leave,
                        contact_person,
                        contact_email,
                        contact_phone,
                        auto_delist,
                    })
                    .where("id", jobId);

                await trx("job_employment_type").where("job_id", jobId).del();

                await trx("job_employment_type").insert(
                    job_employment_type.map((obj: any) => {
                        return { job_id: jobId, type_id: obj.id };
                    })
                );
            });
            return true;
        } catch (error) {
            console.log("EditJob", error);
            return false;
        }
    };
    applyJob = async (userId: number, jobId: number, data: any) => {
        const { email, phone, resume } = data;
        try {
            const userResume = (
                await this.knex.raw(
                    "select resume from users where id = :userId",
                    { userId }
                )
            ).rows[0]["resume"];
            // console.log("userResume ==", userResume);

            await this.knex.transaction(async (trx) => {
                await trx("users")
                    .update({ email, phone, resume })
                    .where("id", userId);

                await trx("applied_jobs").insert({
                    user_id: userId,
                    job_id: jobId,
                    resume: userResume,
                });
            });
            return true;
        } catch (error) {
            console.log("applyJob", error);
            return false;
        }
    };
    getPostJob = async (companyId: number) => {
        try {
            const result = (await this.knex.raw(`
                select j.id as job_id, job_title, job_detail,
                cn.name as company_name, c.avatar, cities.name as city_name,
                countries.name as country_name, i.name as industry, auto_delist,
                j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, experience_requirement
                from jobs as j
                join companies as c on c.id = j.company_id
                join industries as i on i.id = c.industry_id
                join company_names as cn on cn.id = c.name_id
                join cities on cities.id = j.city_id
                join countries on cities.country_id = countries.id
                where j.company_id = :companyId
                and auto_delist >= now();`,
                {companyId})).rows;
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
    closePostJob = async (jobId: number) => {
        try {
            await this.knex.raw(`
                update jobs
                set auto_delist = current_date - interval '1 day'
                where jobs.id = :jobId;`,
                { jobId }
            );
            return { success: true };
        } catch (error) {
            console.log("closePostJob service=>", error);
            return { success: false };
        }
    };
    getHistoryJob = async (companyId: number) => {
        try {
            const result = (await this.knex.raw(`
                select j.id as job_id, job_title, job_detail,
                cn.name as company_name, c.avatar, cities.name as city_name,
                countries.name as country_name, i.name as industry, auto_delist,
                j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, experience_requirement
                from jobs as j
                join companies as c on c.id = j.company_id
                join industries as i on i.id = c.industry_id
                join company_names as cn on cn.id = c.name_id
                join cities on cities.id = j.city_id
                join countries on cities.country_id = countries.id
                where j.company_id = :companyId
                and auto_delist < now();`,
                {companyId})).rows;
                // console.log('his result', result)
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
    openPostJob = async (jobId: number) => {
        try {
            await this.knex.raw(`
                update jobs
                set auto_delist = current_date + interval '30 day'
                where jobs.id = :jobId;`,
                { jobId }
            );
            return { success: true };
        } catch (error) {
            // console.log("openPostJob service=>", error);
            return { success: false };
        }
    };
    getUsersApplyJob = async (jobId: number) => {
        try {
            const result = (await this.knex.raw(`
            select aj.user_id, aj.job_id, aj.resume, u.avatar,
            aj.created_at as apply_date, u.first_name, u.last_name,
            u.email, u.phone
            from applied_jobs as aj
            join users as u on u.id = aj.user_id
            where aj.job_id = :jobId;`, {jobId})).rows;
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
    getJobAppliedByUser = async (userId: number) => {
        try {
            const result = (await this.knex.raw(`
            select job_title, job_detail, aj.resume,
            cn.name as company_name, c.avatar, cities.name as city_name,
            countries.name as country_name, i.name as industry, auto_delist,
            j.created_at as post_date, j.updated_at as update_date, annual_leave, business_size, experience_requirement,
            aj.user_id, aj.job_id, aj.resume, aj.created_at as apply_date,
            (select sj.id where sj.user_id = :userId and sj.job_id = j.id) as bookmark_id
            from applied_jobs as aj
            join jobs as j on j.id = aj.job_id
            join companies as c on c.id = j.company_id
            join industries as i on i.id = c.industry_id
            join users as u on u.id = aj.user_id
            join company_names as cn on cn.id = c.name_id
            join cities on cities.id = j.city_id
            join countries on cities.country_id = countries.id
            JOIN saved_jobs AS sj ON j.id = sj.job_id
            where aj.user_id = :userId;`, {userId})).rows;
            return { success: true, data: result };
        } catch (error) {
            return { success: false };
        }
    };
}
