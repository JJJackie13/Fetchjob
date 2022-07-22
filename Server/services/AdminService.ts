import { Knex } from "knex";

export class AdminService {
    constructor(private knex: Knex) { }
    getCurrentAdmin = async (userId: number) => {
        // const result = await this.knex("users").where("id", userId).select("*");
        const result = (
            await this.knex.raw(
                "select id, first_name, last_name, email, profile_img,headline, gender, phone,birthday, profile_img, cover_img, company_name, industry, introduction, education_id, experience, website from users where users.id = :userId",
                { userId }
            )
        ).rows;
        return result[0];
    };

    //--Admin Info
    getAdminInfo = async (id: number) => {
        try {
            const result = (
                await this.knex.raw(
                    ` select
                users.id
              , users.password
              , users.email
              , users.gender
              , users.first_name
              , users.last_name
              , users.phone
              , users.birthday
              , users.address
              , users.is_admin
              , users.updated_at
              from users
              where users.id = ?`, [id])
            ).rows[0];
            console.log("getAdminInfo", result);
            return {
                success: true,
                data: result,
                usersId: id,
            };
        } catch (error) {
            console.log("getAdminInfo, error:", error);
            return { success: false, message: error };
        }
    };


    updateAdmin = async (userId: number, id: number, body: any) => {
        const {
            first_name,
            last_name,
            phone,
            address
        } = body;
        try {
            const isAdmin = (await this.knex.raw(
                `select is_admin from users where id = ${userId};`
            )).rows[0].is_admin;
            if (isAdmin) {
                await this.knex.transaction(async (trx) => {
                    await trx("users")
                        .update({
                            first_name,
                            last_name,
                            phone,
                            address,
                            updated_at: new Date(),
                        })
                        .where("id", id);
                });
                return { success: true, message: "Updated Admin Info successfully" };
            } else {
                return { success: false, message: "Unauthorized." };
            }
        } catch (error) {
            console.log("updateuserState", error)
            return { success: false, message: "Failed to update admin info!", error };
        }
    };



    //--update User
    updateUserState = async (userId: number, id: number, body: any) => {
        const { is_verified, is_activated } = body;
        try {
            const isAdmin = (
                await this.knex.raw(
                    `select is_admin from users where id = ${userId};`
                )
            ).rows[0].is_admin;
            if (isAdmin) {
                await this.knex.transaction(async (trx) => {
                    await trx("users")
                        .update({
                            is_verified,
                            is_activated,
                            updated_at: new Date(),
                        })
                        .where("id", id);
                });
                return { success: true, message: "Updated successfully" };
            } else {
                return { success: false, message: "Unauthorized." };
            }
        } catch (error) {
            console.log("updateuserState", error);
            return { success: false, message: "Failed to update.", error };
        }
    };

    //--update Post
    updatePostState = async (
        userId: number,
        postsId: number,
        is_activated: boolean
    ) => {
        try {
            const isAdmin = (
                await this.knex.raw(
                    `select is_admin from users where id = ${userId};`
                )
            ).rows[0].is_admin;
            if (isAdmin) {
                await this.knex.transaction(async (trx) => {
                    await trx("posts")
                        .update({
                            is_activated,
                            updated_at: new Date(),
                        })
                        .where("id", postsId);
                });
                return { success: true, message: "Updated successfully" };
            } else {
                return { success: false, message: "Unauthorized." };
            }
        } catch (error) {
            console.log("updateuserState", error);
            return { success: false, message: "Failed to update.", error };
        }
    };

    //--update Company
    updateCompanyState = async (userId: number, id: number, body: any) => {
        const { is_verified, is_activated } = body;
        try {
            const isAdmin = (
                await this.knex.raw(
                    `select is_admin from users where id = ${userId};`
                )
            ).rows[0].is_admin;
            if (isAdmin) {
                await this.knex.transaction(async (trx) => {
                    await trx("companies")
                        .update({
                            is_verified,
                            is_activated,
                            updated_at: new Date(),
                        })
                        .where("id", id);
                });
                return { success: true, message: "Updated successfully" };
            } else {
                return { success: false, message: "Unauthorized." };
            }
        } catch (error) {
            console.log("updateCompanyState", error);
            return { success: false, message: "Failed to update.", error };
        }
    };

    //--Report List
    getReportList = async (filter: any, name: any) => {
        try {
            let tableQueries: string[] = []
            if (filter === 'Post' || filter === 'All') {
                tableQueries.push(`
                select reporter_id,
                    post_reports.id as report_id,
                    'post' as report_table,
                    post_reports.updated_at as report_updated_time,
                    solved_at,
                    post_report_types.name as report_type_name,
                    posts.content as target_name
                from post_reports
                    inner join post_report_types on post_report_types.id = post_reports.type_id
                    inner join posts on posts.id = post_reports.post_id
`)
            }
            if (filter === 'User' || filter === 'All') {
                tableQueries.push(`
                select reporter_id,
                    user_reports.id as report_id,
                    'user' as report_table,
                    user_reports.updated_at as report_updated_time,
                    solved_at,
                    report_types.name as report_type_name,
                    concat(users.first_name, ' ', users.last_name) as target_name
                from user_reports
                    inner join report_types on report_types.id = user_reports.type_id
                    inner join users on users.id = user_reports.user_id
`)
            }
            if (filter === 'Company' || filter === 'All') {
                tableQueries.push(`
                select reporter_id,
                    company_reports.id as report_id,
                    'company' as report_table,
                    company_reports.updated_at as report_updated_time,
                    solved_at,
                    report_types.name as report_type_name,
                    company_names.name as target_name
                from company_reports
                    inner join report_types on report_types.id = company_reports.type_id
                    inner join companies on companies.id = company_reports.company_id
                    inner join company_names on company_names.id = companies.name_id
`)
            }
            let result = await this.knex.raw(`
            with reports as (
                ${tableQueries.join(' union ')}
            )
            SELECT reports.solved_at is not null as admin_is_solved,
                reporter_id,
                concat(users.first_name, ' ', users.last_name) as reported_user_name,
                report_updated_time,
                report_id,
                report_table,
                null as reject_reason,
                report_type_name,
                target_name
            from reports
                inner join users on users.id = reports.reporter_id
            where reports.target_name ilike ?
            order by report_updated_time desc
            `, [`${name}%`])
            console.log({ name })
            return {
                success: true,
                result: result.rows
            };
        } catch (error) {
            console.log("getReportList,error: ", error);
            return { success: false, message: error };
        }
    }


    getReportInfo = async (report_table: any, report_id: number) => {
        try {

            let tableQuery: string

            if (report_table === 'company') {
                tableQuery = `
                select reporter_id,
                    company_reports.remark as report_remark,
                    company_reports.id as report_id,
                    'company' as report_table,
                    company_reports.updated_at as report_updated_time,
                    company_reports.is_solved as is_solved,
                    company_reports.solved_at as solved_at,
                    report_types.name as report_type_name,
                    company_names.name as target_name,
                    companies.updated_at as target_updated_at,
                    companies.avatar as target_name_img,
                    companies.id as target_name_id
                from company_reports
                    inner join report_types on report_types.id = company_reports.type_id
                    inner join companies on companies.id = company_reports.company_id
                    inner join company_names on company_names.id = companies.name_id
                where company_reports.id = ?
                `
            } else if (report_table === 'post') {
                tableQuery = `
                select reporter_id,
                    post_reports.remark as report_remark,
                    post_reports.id as report_id,
                    'post' as report_table,
                    post_reports.updated_at as report_updated_time,
                    post_reports.is_solved as is_solved,
                    post_reports.solved_at as solved_at,
                    post_report_types.name as report_type_name,
                    posts.content as target_name,
                    posts.updated_at as target_updated_at,
                    post_images.image as target_name_img,
                    posts.id as target_name_id
                from post_reports
                    inner join post_report_types on post_report_types.id = post_reports.type_id
                    inner join posts on posts.id = post_reports.post_id
                    inner join post_images on post_images.post_id = post_reports.id
                where post_reports.id = ?
                `
            } else if (report_table === 'user') {
                tableQuery = `
                select reporter_id,
                    user_reports.remark as report_remark,
                    user_reports.id as report_id,
                    'user' as report_table,
                    user_reports.updated_at as report_updated_time,
                    user_reports.is_solved as is_solved,
                    user_reports.solved_at as solved_at,
                    
                    report_types.name as report_type_name,
                    concat(users.first_name, ' ', users.last_name) as target_name,
                    users.updated_at as target_updated_at,
                    users.avatar as target_name_img,
                    users.id as target_name_id
                from user_reports
                    inner join report_types on report_types.id = user_reports.type_id
                    inner join users on users.id = user_reports.user_id
                where user_reports.id = ?
                `
            } else {


                throw new Error('invalid report_table: ' + report_table)
            }


            let result = await this.knex.raw(`
            with report_info as (
                ${tableQuery}
            )
            SELECT report_info.solved_at is not null as admin_is_solved,
                reporter_id,
                report_remark,
                concat(users.first_name, ' ', users.last_name) as reported_user_name,
                is_solved ,
                solved_at,
                report_updated_time,
                report_id,
                report_table,
                null as reject_reason,
                report_type_name,
                target_name,
                target_updated_at,
                target_name_img,
                target_name_id
            from report_info
                inner join users on users.id = report_info.reporter_id
            `, [report_id])

            return {
                success: true,
                result: result.rows[0]
            };
        } catch (error) {
            console.log("getReportInfo,error: ", error);
            return { success: false, message: error };
        }
    }


    async resolveReport(userId: number, report_table: any, report_id: number, body: any) {
        const { is_solved } = body;
        try {
            const isAdmin = (
                await this.knex.raw(
                    `select is_admin from users where id = ${userId};`
                )
            ).rows[0].is_admin;
            if (isAdmin) {
                await this.knex(report_table + '_reports')
                    .update({
                        is_solved,
                        solved_at: this.knex.fn.now()
                    })
                    .where({ id: report_id })
                return { success: true, result: 'updated successfully' }
            } else {
                return { success: false, message: "Unauthorized." };
            }
        } catch (error) {
            console.log("resolveReport error:", error);
            return { success: false, message: "Failed to update.", error };
        }

    };
}
