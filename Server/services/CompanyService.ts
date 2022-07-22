import { Knex } from "knex";
import fs from "fs";
import path from "path";
import { CompanyControlLevel } from "../enums/enums";

export class CompanyService {
    constructor(private knex: Knex) {}
    getCompanyById = async (userId: number, companyId: number) => {
        try {
            const company = await this.knex("companies as c")
                .select(
                    "*",
                    "c.id as id",
                    "i.name as industry",
                    "cn.name as company_name",
                    "ct.name as company_type",
                    "cities.name as city",
                    "countries.name as country"
                )
                .join("industries as i", "c.industry_id", "i.id")
                .join("company_names as cn", "c.name_id", "cn.id")
                .join("company_types as ct", "c.type_id", "ct.id")
                .join("cities", "c.city_id", "cities.id")
                .join("countries", "cities.country_id", "countries.id")
                .where("c.id", companyId)
                .first();

            const followers = await this.getCompanyFollowers(companyId);
            if (!followers) {
                return false;
            }
            const isFollower = followers.some(
                (obj: any) => obj.user_id == userId
            );
            const owners = (
                await this.knex.raw(
                    `select u.id, u.first_name, u.last_name, u.avatar, level
                    from company_owners as co 
                    join users as u on u.id = co.user_id 
                    join control_levels as cl on cl.id = co.control_level_id
                    where company_id = ${companyId}
                    order by co.created_at asc, level desc
                    `
                )
            ).rows;
            const ownerResult = await this.knex("company_owners as co")
                .join("control_levels as cl", "co.control_level_id", "cl.id")
                .select("*")
                .where("user_id", userId)
                .andWhere("company_id", companyId);

            // Verify if company owned by user
            // const isOwner = owners.some((obj: any) => obj.id == userId);
            return {
                data: company,
                isFollower: isFollower,
                followerCount: followers.length,
                owners: owners,
                isOwner: ownerResult.length === 1,
                ownerControlLevel:
                    ownerResult && ownerResult[0] ? ownerResult[0].level : 0,
            };
        } catch (error) {
            console.log("getCompanyById=>", error);
            return false;
        }
    };
    getOwnedCompanies = async (userId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    `
            select c.id as company_id, cn.name as company_name, c.avatar, cl.level as owner_control_level
            from company_owners as co 
            join companies as c on co.company_id = c.id 
            join company_names as cn on c.name_id = cn.id 
            join control_levels as cl on co.control_level_id = cl.id 
            where user_id = :userId;
            `,
                    { userId }
                )
            ).rows;

            return { data: result };
        } catch (error) {
            console.log("getOwnedCompanies", error);
            return false;
        }
    };
    getAllTypes = async () => {
        try {
            const result = (await this.knex.raw("select * from company_types"))
                .rows;

            // const

            return { success: true, data: result };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    };
    getAllCompanyInfo = async () => {
        try {
            const result = (
                await this.knex.raw(
                    `select cn.id as company_name_id, cn.name as company_name, c.avatar as company_avatar, i.name as company_industry
                    from company_names as cn join companies as c on c.name_id = cn.id
                    join industries as i on i.id = c.industry_id`
                )
            ).rows;

            // const

            return { success: true, data: result };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    };
    getMasterByUserAndCompanyId = async (userId: number, companyId: number) => {
        try {
            console.log("getMasterByUserAndCompanyId ");

            const result = (
                await this.knex.raw(`select 
                u.id as user_id,
                u.first_name,
                u.email,
                c.id as company_id,
                cn.name,
                cl.name as control_level_name
                from users u 
                join company_owners co 
                on co.user_id = u.id 
                join companies c on c.id  = co.company_id 
                join company_name cn on cn.id = c.id 
                join control_levels cl on cl.id = co.control_level 
                where cl.name = 'master'
                and u.id = ${userId}
                and c.id = ${companyId}`)
            ).rows;
            console.log("getmaterresult=", result);
            return {
                success: true,
                data: result,
                userId: userId,
            };
        } catch (error) {
            return { success: false, message: error };
        }
    };
    getCompanyFollowers = async (companyId: number) => {
        try {
            const result = await this.knex("followed_companies")
                .select("*")
                .where("company_id", companyId);
            return result;
        } catch (error) {
            console.log("getCompanyLikeCount=>", error);
            return false;
        }
    };
    editBasicInfo = async (companyId: number, data: any) => {
        try {
            const companyData = { ...data, updated_at: this.knex.fn.now() };
            delete companyData["name"];
            const nameId = (
                await this.knex("companies")
                    .select("name_id")
                    .where("id", companyId)
            )[0]["name_id"];
            await this.knex.transaction(async (trx) => {
                await trx("companies")
                    .update(companyData)
                    .where("id", companyId);
                await trx("company_names")
                    .update({ name: data["name"], updated_at: trx.fn.now() })
                    .where("id", nameId);
            });
            return true;
        } catch (error) {
            console.log("editCompanyBasicInfo =>", error);
            return false;
        }
    };
    deleteAvatar = async (companyId: number) => {
        try {
            const oldImg = (
                await this.knex.raw(
                    "select avatar from companies where id = :companyId",
                    { companyId }
                )
            ).rows[0]["avatar"];
            await this.knex.raw(
                "update companies set avatar = '', updated_at = NOW() where id = :companyId",
                { companyId }
            );
            if (
                oldImg &&
                fs.existsSync(path.resolve("./uploads/company", oldImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/company", oldImg));
            }
            return true;
        } catch (error) {
            return false;
        }
    };
    deleteBanner = async (companyId: number) => {
        try {
            const oldImg = (
                await this.knex.raw(
                    "select banner from companies where id = :companyId",
                    { companyId }
                )
            ).rows[0]["banner"];
            await this.knex.raw(
                "update companies set banner = '', updated_at = NOW() where id = :companyId",
                { companyId }
            );
            if (
                oldImg &&
                fs.existsSync(path.resolve("./uploads/company", oldImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/company", oldImg));
            }
            return true;
        } catch (error) {
            return false;
        }
    };
    updateAvatar = async (companyId: number, fileData: any) => {
        const newImg = fileData["filename"];
        try {
            const oldImg = (
                await this.knex.raw(
                    "select avatar from companies where id = :companyId",
                    { companyId }
                )
            ).rows[0]["avatar"];

            await this.knex.raw(
                "update companies set avatar = :newImg , updated_at = NOW() where id = :companyId",
                { newImg, companyId }
            );
            if (
                oldImg &&
                fs.existsSync(path.resolve("./uploads/company", oldImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/company", oldImg));
            }

            if (
                newImg &&
                fs.existsSync(path.resolve("./uploads/temp", newImg))
            ) {
                fs.renameSync(
                    path.resolve("./uploads/temp", newImg),
                    path.resolve("./uploads/company", newImg)
                );
            }
            return true;
        } catch (error) {
            console.log("updateAvatar", error);
            return false;
        } finally {
            if (
                newImg &&
                fs.existsSync(path.resolve("./uploads/temp", newImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/temp", newImg));
            }
        }
    };
    updateBanner = async (companyId: number, fileData: any) => {
        const newImg = fileData["filename"];
        try {
            const oldImg = (
                await this.knex.raw(
                    "select banner from companies where id = :companyId",
                    { companyId }
                )
            ).rows[0]["banner"];

            await this.knex.raw(
                "update companies set banner = :newImg , updated_at = NOW() where id = :companyId",
                { newImg, companyId }
            );
            if (
                oldImg &&
                fs.existsSync(path.resolve("./uploads/company", oldImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/company", oldImg));
            }

            if (
                newImg &&
                fs.existsSync(path.resolve("./uploads/temp", newImg))
            ) {
                fs.renameSync(
                    path.resolve("./uploads/temp", newImg),
                    path.resolve("./uploads/company", newImg)
                );
            }
            return true;
        } catch (error) {
            return false;
        } finally {
            if (
                newImg &&
                fs.existsSync(path.resolve("./uploads/temp", newImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/temp", newImg));
            }
        }
    };
    createPost = async (companyId: number, content: string) => {
        try {
            console.log("(service)companyId=", companyId);
            const postResult = await this.knex("posts").insert({
                company_id: companyId,
                content: content,
            });
            console.log("user's post posted:", postResult);
            return { success: true };
        } catch (error) {
            console.log(error);

            return { success: false, message: error };
        }
    };
    getCompanyPosts = async (companyId: number) => {
        const postData = await this.knex
            .select("*")
            .from("posts")
            .where({ company_id: companyId })
            .orderBy("created_at", "desc");
        if (false) console.log("errorPostData=", postData);
        const companyData = await this.knex
            .select("*")
            .from("companies")
            .where({ id: companyId });

        // delete userData["password"];
        if (false) console.log("errorUserData=", companyData);
        console.log("postData=", postData);
        console.log("postUserData=", companyData);
        //if (postData.length === 0) {
        //    return {
        //        success: false,
        //        message: "User did not have any post yet",
        //    };
        //} else {
        const result = { postData, companyData };

        return result;
    };

    getOwnedCompanyById = async (userId: number, companyId: number) => {
        // Verify if company owned by user
        const ownedCompanyList = (
            await this.knex.raw(
                `select * from company_owners as co where co.user_id = :userId;`,
                { userId }
            )
        ).rows;

        const isOwner =
            ownedCompanyList.filter((co: any) => co.company_id === companyId)
                .length > 0;

        if (isOwner) {
            const company = (
                await this.knex.raw(
                    `select c.id, cn.name, introduction, website, logo_img, address, email, phone, type, industry, business_size, establish_in, company_registry, account_level from companies as c
                join company_name as cn
                on c.name = cn.id where c.id = :companyId`,
                    { companyId }
                )
            ).rows[0];
            return { success: true, data: company };
        } else {
            return { success: false, message: "Not authorised." };
        }
    };

    followCompany = async (userId: number, companyId: number) => {
        try {
            const isFollower =
                (
                    await this.knex("followed_companies")
                        .select("*")
                        .where("user_id", userId)
                        .andWhere("company_id", companyId)
                ).length > 0;
            if (isFollower) {
                await this.knex("followed_companies")
                    .where("user_id", userId)
                    .andWhere("company_id", companyId)
                    .del();
                return { isFollower: !isFollower };
            } else {
                await this.knex("followed_companies").insert({
                    user_id: userId,
                    company_id: companyId,
                });
                return { isFollower: !isFollower };
            }
        } catch (error) {
            console.log("followCompany", error);
            return false;
        }
    };

    // ELSA
    allCompanyList = async (name: any, category: any) => {
        try {
            let query = this.knex
                .select(
                    `companies.avatar`,
                    `companies.email`,
                    `companies.phone`,
                    `companies.is_verified`,
                    `companies.is_activated`,
                    `companies.id`,
                    `company_names.name as company_name`
                )
                .from("companies")
                .leftJoin(
                    "company_names",
                    "company_names.id",
                    "companies.name_id"
                );
            if (name) {
                query = query
                    .where("company_names.name", "ilike", `%${name}%`)
                    .orWhere("companies.email", "ilike", `%${name}%`);
            }
            if (category) {
                query = query
                    .leftJoin(
                        "company_types",
                        "company_types.id",
                        "companies.type_id"
                    )
                    .andWhere("company_types.id", "=", category);
            }
            const allCompany = await query;
            const allType = await this.knex
                .select("id", "name")
                .from("company_types");
            return {
                success: true,
                allCompany,
                allType,
            };
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    };

    getCompanyInfoByCompanyId = async (companiesId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    `select 
                    companies.introduction
                  , companies.website 
                  , companies.avatar 
                  , companies.banner
                  , companies.address 
                  , companies.email 
                  , companies.phone 
                  , companies.business_size 
                  , companies.establish_in 
                  , companies.company_registry 
                  , companies.updated_at 
                  , companies.is_verified 
                  , companies.is_activated 
                  , companies.id 
                  , company_names.name as company_name 
                  , cities.name as city_name
                  , company_types.name as type_name
                  , industries.name as industry_name
                  , account_levels.name as account_level
                  , users.first_name as owner_first_name
                  , users.last_name as owner_last_name
                  , account_levels.level as company_ac_level
                  , posts.id as post_id
                  , posts.content as post_content
                  , posts.updated_at as post_updated_at
                  , posts.is_public as post_public
                  , posts.is_activated as post_activated
                  , post_images.image as post_img
                  , post_comments.content as post_comment
                  , post_comments.updated_at as post_comment_updated
              from companies
              left join company_names on company_names.id = companies.name_id
              left Join cities on cities.id = companies.city_id
              left Join company_types on company_types.id = companies.type_id
              left Join industries on industries.id = companies.industry_id 
              left Join account_levels on account_levels.id = companies.account_level_id
              left Join company_owners on company_owners.company_id = companies.id
              left Join users on users.company_name_id = company_names.id
              left join posts on posts.company_id = companies.id
              left join post_images on post_images.post_id = posts.id
              left join post_comments on post_comments.post_id = posts.id
            where companies.id = ${companiesId}`
                )
            ).rows[0];
            console.log("getComapnyInfoResult", result);
            return {
                success: true,
                data: result,
                companiesId: companiesId,
            };
        } catch (error) {
            console.log("getInfoByCompanyId, error:", error);
            return { success: false, message: error };
        }
    };

    addController = async (
        userId: number,
        companyId: number,
        targetUserId: number
    ) => {
        try {
            await this.knex.transaction(async (trx) => {
                const requesterLevel = (
                    await trx("company_owners as co")
                        .join(
                            "control_levels as cl",
                            "cl.id",
                            "co.control_level_id"
                        )
                        .select("level")
                        .where("user_id", userId)
                        .andWhere("company_id", companyId)
                )[0].level;
                if (requesterLevel != CompanyControlLevel.MASTER) {
                    let error = "Unauthorized";
                    await trx.rollback(error);
                }
                // check if already exist
                const controllerExisted =
                    (
                        await trx("company_owners as co")
                            .select("*")
                            .where("company_id", companyId)
                            .andWhere("user_id", targetUserId)
                    ).length > 0;
                if (controllerExisted) {
                    let error = "Target user is already controller";
                    await trx.rollback(error);
                }
                const adminLevelId = (
                    await this.knex("control_levels")
                        .select("id")
                        .where("level", CompanyControlLevel.ADMIN)
                )[0].id;
                await trx("company_owners").insert({
                    user_id: targetUserId,
                    company_id: companyId,
                    control_level_id: adminLevelId,
                });
            });
            return { success: true };
        } catch (error) {
            console.log("removeController", error);
            return { success: false, message: error.toString() };
        }
    };
    editControllerLevel = async (
        userId: number,
        companyId: number,
        targetUserId: number,
        levelId: number
    ) => {
        try {
            await this.knex.transaction(async (trx) => {
                const requesterLevel = (
                    await trx("company_owners as co")
                        .join(
                            "control_levels as cl",
                            "cl.id",
                            "co.control_level_id"
                        )
                        .select("level")
                        .where("user_id", userId)
                        .andWhere("company_id", companyId)
                )[0].level;
                if (requesterLevel != CompanyControlLevel.MASTER) {
                    let error = "Unauthorized";
                    await trx.rollback(error);
                }
                await trx("company_owners")
                    .update({
                        control_level_id: levelId,
                        updated_at: this.knex.fn.now(),
                    })
                    .where("user_id", targetUserId)
                    .andWhere("company_id", companyId);
                const mastersResult = await trx("company_owners as co")
                    .join(
                        "control_levels as cl",
                        "cl.id",
                        "co.control_level_id"
                    )
                    .select("*")
                    .where("company_id", companyId)
                    .andWhere("level", 2);
                if (mastersResult.length < 1) {
                    let error = "Company must have at least 1 master";
                    await trx.rollback(error);
                }
            });
            return { success: true };
        } catch (error) {
            console.log("removeController", error);
            return { success: false, message: error.toString() };
        }
    };
    removeController = async (
        userId: number,
        companyId: number,
        targetUserId: number
    ) => {
        try {
            await this.knex.transaction(async (trx) => {
                const mastersResult = await trx("company_owners as co")
                    .join(
                        "control_levels as cl",
                        "cl.id",
                        "co.control_level_id"
                    )
                    .select("*")
                    .where("company_id", companyId)
                    .andWhere("level", CompanyControlLevel.MASTER);
                if (!mastersResult.some((obj) => obj.user_id == userId)) {
                    let error = "Unauthorized";
                    await trx.rollback(error);
                }
                if (mastersResult.length < 1) {
                    let error = "Company must have at least 1 master";
                    await trx.rollback(error);
                }
                await trx("company_owners")
                    .where("user_id", targetUserId)
                    .del();
            });
            return { success: true };
        } catch (error) {
            console.log("removeController", error);
            return { success: false, message: error.toString() };
        }
    };
    getCompanyListByQuery = async (keywords: string, offset: number) => {
        try {
            console.log(keywords);
            let limit = 20;
            let totalOffset = limit * offset;
            const result = (
                await this.knex.raw(`
            select c.id, c.avatar, cn.name as company_name, i.name as industry, c.website 
            from companies as c join industries i on c.industry_id = i.id 
            join company_names cn on c.name_id = cn.id 
            where c.is_verified = true 
            and c.is_activated = true 
            and (cn.name ilike '%${keywords}%' )
            limit ${limit}
            offset ${totalOffset}`)
            ).rows;
            console.log(result);
            return result;
        } catch (error) {
            console.log("getCompanyListByQuery", error);
            return false;
        }
    };
    getCompanyReviewsByCompanyId = async (companyId: number) => {
        try {
            const avgRating = (
                await this.knex.raw(
                    `
            select avg(rating) from company_reviews cr 
            where cr.company_id = :companyId group by cr.company_id`,
                    { companyId }
                )
            ).rows;
            const data = (
                await this.knex.raw(
                    `
            select cr.id, cn.name, cr.created_at, cr.review_title, cr.rating , cr.commenter_type_id, ct.name as commenter_type, et.name as employment_type, cr.job_title, pos_comment ,neg_comment ,extra_comment 
            from company_reviews cr 
            join companies c on cr.company_id = c.id 
            join company_names cn on c.name_id = cn.id
            join commenter_types ct on ct.id =cr.commenter_type_id 
            join employment_types et on et.id = cr.employment_type_id
            where cr.company_id = :companyId
            order by cr.created_at desc`,
                    { companyId }
                )
            ).rows;
            return { avgRating: parseFloat(avgRating[0].avg).toFixed(1), data };
        } catch (error) {
            console.log("getCompanyReviewsByCompanyId", error);
            return false;
        }
    };
    postCompanyReview = async (
        userId: number,
        companyId: number,
        data: any
    ) => {
        try {
            await this.knex("company_reviews").insert({
                user_id: userId,
                company_id: companyId,
                ...data,
            });
            return true;
        } catch (error) {
            console.log("postCompanyReview", error);
            return false;
        }
    };

    //elsa

    getPostByCo = async (id: any) => {
        try {
            const query = (
                await this.knex.raw(
                    ` select companies.id
                    , companies.avatar 
                    , companies.is_verified 
                    , company_names.name
                    , posts.id as post_id
                    , posts.content as post_content
                    , posts.updated_at as post_updated
                    from companies
                    inner join posts on posts.company_id = companies.id
                    left join company_names on company_names.id = companies.name_id 
                    where companies.id = ${id}
                    order by post_updated desc`
                )
            ).rows;
            const allPosts = await query;
            console.log("getPostByCo", allPosts);
            return {
                success: true,
                allPosts,
                id: id,
            };
        } catch (error) {
            console.log("getPostByCo, error:", error);
            return { success: false, message: error };
        }
    };
}
