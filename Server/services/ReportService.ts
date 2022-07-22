import { Knex } from "knex";
import { adminIo } from "../socketio";

export class ReportService {
    constructor(private knex: Knex) {

        // setTimeout(() => {
        //     console.log('test report notice')
        //     adminIo.emit("report:company", 39)
        // }, 5000)

        // setTimeout(() => {
        //     console.log('test report notice')
        //     this.reportPost(
        //         12, 14, 6, "ELSA JEH"
        //     )

        // }, 5000)

    }
    reportPost = async (
        userId: number,
        postId: number,
        typeId: number,
        remark: string | undefined
    ) => {
        try {
            const [report_id] = await this.knex("post_reports").insert({
                post_id: postId,
                type_id: typeId,
                reporter_id: userId,
                remark: remark ? remark : null,
            }).returning('id');
            adminIo.emit("report:post", report_id)
            return true;
        } catch (error) {
            console.log("reportPost=>", error);
            return false;
        }
    };
    reportUser = async (
        userId: number,
        targetUserId: number,
        typeId: number,
        remark: string | undefined
    ) => {
        try {
            const [report_id] = await this.knex("user_reports").insert({
                user_id: userId,
                type_id: typeId,
                reporter_id: userId,
                remark: remark ? remark : null,
            }).returning('id');
            adminIo.emit("report:user", report_id)
            return true;
        } catch (error) {
            console.log("reportUser=>", error);
            return false;
        }
    };
    reportCompany = async (
        userId: number,
        companyId: number,
        typeId: number,
        remark: string | undefined
    ) => {
        try {
            const [report_id] = await this.knex("company_reports").insert({
                company_id: companyId,
                type_id: typeId,
                reporter_id: userId,
                remark: remark ? remark : null,
            }).returning('id');
            adminIo.emit("report:company", report_id)
            return true;
        } catch (error) {
            console.log("reportCompany=>", error);
            return false;
        }
    };


    //elsa

    repoByPostId = async (id: any) => {
        try {

            const query = (
                await this.knex.raw(
                    ` select 
                    post_reports.id as report_id
                    , post_reports.is_solved 
                    , post_reports.solved_at 
                    , post_reports.remark
                    , post_reports.post_id 
                    , post_reports.updated_at 
                    , post_report_types.name as report_type
                    , post_reports.reporter_id
                    , concat(users.first_name, ' ', users.last_name) as reporter_name
                    from post_reports
                    left join post_report_types on post_report_types.id = post_reports.type_id 
                    left join users on users.id = post_reports.reporter_id 
                    where post_reports.post_id = ${id}
                    order by updated_at desc`
                )
            ).rows;
            const allReport = await query;
            console.log("reportByUserId", allReport);
            return {
                success: true,
                allReport,
                id: id,
            };
        } catch (error) {
            console.log("reportByUserId, error:", error);
            return { success: false, message: error };
        }
    };

}
