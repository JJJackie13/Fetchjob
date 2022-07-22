import { Knex } from "knex";
import {
    EnumLayout,
    friendRelationStatus,
} from "../enums/FriendRelationStatusEnum";
// import { logger } from "../logger";
import { NetworkService } from "./NetworkService";

export class UserService {
    constructor(private knex: Knex) { }

    getCurrentUser = async (userId: number) => {
        // const result = await this.knex("users").where("id", userId).select("*");
        const result = (
            await this.knex.raw(
                "select id, first_name, last_name, email, profile_img,headline, gender, phone,birthday, profile_img, cover_img, company_name, industry, introduction, education_id, experience, website from users where users.id = :userId",
                { userId }
            )
        ).rows;
        return result[0];
    };
    getUserProfileById = async (userId: number, targetId: number) => {
        try {
            const networkService = new NetworkService(this.knex);
            let data = {};
            const user = await this.knex("users")
                .leftJoin("industries", "users.industry_id", "industries.id")
                .leftJoin(
                    "company_names",
                    "users.company_name_id",
                    "company_names.id"
                )
                .leftJoin("cities", "users.city_id", "cities.id")
                .leftJoin("countries", "cities.country_id", "countries.id")
                .leftJoin("education", "users.education_id", "education.id")
                .select(
                    "*",
                    "users.id as id",
                    "industries.name as industry",
                    "company_names.name as company_name",
                    "cities.name as city",
                    "countries.name as country",
                    "education.name as education",
                    "users.created_at"
                )
                .where("users.id", targetId)
                .first();

            const userHobbies = await this.knex
                .select("id", "content")
                .from("user_hobbies")
                .where({ user_id: targetId });

            const userSkills = await this.knex
                .select("id", "content")
                .from("user_skills")
                .where({ user_id: targetId });

            const numberOfConnections = (
                await this.knex("networks")
                    .select("*")
                    .where(function () {
                        this.where("requester_id", targetId).orWhere(
                            "receiver_id",
                            targetId
                        );
                    })
                    .andWhere("is_pending", false)
            ).length;
            const relationship = await networkService.getRelationshipById(
                userId,
                targetId
            );

            if (
                !user ||
                !userHobbies ||
                !userSkills ||
                isNaN(numberOfConnections) ||
                !relationship
            ) {
                return { success: false };
            }

            data = {
                profile: user,
                hobbies: userHobbies,
                skills: userSkills,
                numberOfConnections,
                relationship,
            };

            return { success: true, data };
        } catch (error) {
            console.log("getUserProfileById", error);
            return { success: false };
        }
    };
    getFriendRelationStatusById = async (
        userId: number,
        targetUserId: number
    ) => {
        console.log({ userId, targetUserId });

        const result = await this.knex
            .select("*")
            .from("networks")
            .where({
                requester_id: userId,
                receiver_id: targetUserId,
            })
            .orWhere({
                receiver_id: userId,
                requester_id: targetUserId,
            })
            .first();
        console.log(result);

        if (result && !result.is_pending) {
            return (<EnumLayout>friendRelationStatus["ALREADY_FRIEND"]).value;
        }
        if (!result) {
            return (<EnumLayout>friendRelationStatus["NOT_FRIEND"]).value;
        }
        if (userId == result.requester_id) {
            return (<EnumLayout>friendRelationStatus["ALREADY_MAKE_REQUEST"])
                .value;
        }
        //if (userId == result.receiver_id) {
        //    return (<EnumLayout>friendRelationStatus["RECEIVED_FRIEND_REQUEST"])
        //        .value;
        //}
        return "invalid record";
    };
    makeRequest = async (requesterId: number, receiverId: number) => {
        try {
            // const pendingRequest =
            //     (
            //         await this.knex.raw(
            //             `select * from networks as n
            // where (n.requester_id = :requesterId and n.receiver_id = :receiverId or n.requester_id = :receiverId and n.receiver_id = :requesterId)
            // and is_pending = true;`,
            //             { requesterId, receiverId }
            //         )
            //     ).rows.length > 0;
            // const alreadyFriend =
            //     (
            //         await this.knex.raw(
            //             `select * from networks as n
            // where (n.requester_id = :requesterId and n.receiver_id = :receiverId or n.requester_id = :receiverId and n.receiver_id = :requesterId)
            // and is_pending = false;`,
            //             { requesterId, receiverId }
            //         )
            //     ).rows.length > 0;
            const hasRelationship =
                (
                    await this.knex.raw(
                        `select * from networks as n 
                        where (n.requester_id = :requesterId and n.receiver_id = :receiverId or n.requester_id = :receiverId and n.receiver_id = :requesterId);`,
                        { requesterId, receiverId }
                    )
                ).rows.length > 0;
            //     const noRelationship =
            //         (
            //             await this.knex.raw(
            //                 `select * from networks as n
            // where (n.requester_id = :requesterId and n.receiver_id = :receiverId or n.requester_id = :receiverId and n.receiver_id = :requesterId);`,
            //                 { requesterId, receiverId }
            //             )
            //         ).rows.length == 0;

            // console.log("hasRelationship", hasRelationship);
            // console.log("noRelationship", noRelationship);

            if (hasRelationship) {
                // REMOVE NETWORK
                await this.knex.raw(
                    "delete from networks as n where (n.requester_id = :requesterId and n.receiver_id = :receiverId) or (n.requester_id = :receiverId and n.receiver_id = :requesterId);",
                    { requesterId, receiverId }
                );
                return { success: true, message: "Removed." };
            } else {
                // SEND REQUEST
                await this.knex("networks").insert({
                    requester_id: requesterId,
                    receiver_id: receiverId,
                    is_pending: true,
                });
                return { success: true, message: "Sent request" };
            }
        } catch (error) {
            console.log(error);

            return { success: false, message: "Failed." };
        }
    };
    getUserPosts = async (userId: number, readerId: number) => {
        const postData = await this.knex
            .select("*")
            .from("posts")
            .where({ user_id: userId })
            .orderBy("created_at", "desc");

        const readerLikedPosts = (
            await this.knex.raw(
                "select pl.post_id from post_likes as pl where user_id = :readerId",
                { readerId }
            )
        ).rows;

        // console.log("errorPostData=", postData);
        const userData = await this.knex
            .select("*")
            .from("users")
            .where({ id: userId });
        delete userData["password"];
        // console.log("errorUserData=", userData);
        // console.log("postData=", postData);
        // console.log("postUserData=", userData);
        //if (postData.length === 0) {
        //    return {
        //        success: false,
        //        message: "User did not have any post yet",
        //    };
        //} else {
        const result = { postData, userData, readerLikedPosts };

        return result;
    };
    getAllUsersByKeywords = async (currentUserId: number, query: string) => {
        try {
            const newQuery = `and (first_name ilike '%${query}%' or last_name ilike '%${query}%')`;
            const result = (
                await this.knex.raw(
                    `select u.id, u.first_name, u.last_name, u.profile_img, u.headline from users as u where id != :currentUserId ${newQuery};`,
                    { currentUserId }
                )
            ).rows;
            return { success: true, data: result };
        } catch (error) {
            console.log(error);
            return { success: false, message: error };
        }
    };
    getEducationOptions = async () => {
        try {
            const result = (await this.knex.raw("select * from education"))
                .rows;
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: error };
        }
    };

    createPost = async (userId: number, content: string) => {
        try {
            const postResult = await this.knex("posts").insert({
                user_id: userId,
                content: content,
            });
            console.log("user's post posted:", postResult);
            return { success: true };
        } catch (error) {
            console.log(error);

            return { success: false, message: error };
        }
    };
    likePost = async (userId: number, postId: number) => {
        try {
            const is_liked =
                (
                    await this.knex.raw(
                        "select * from post_likes where post_id = :postId and user_id = :userId",
                        { postId, userId }
                    )
                ).rows.length > 0;

            if (is_liked) {
                await this.knex.raw(
                    "delete from post_likes where post_id = :postId and user_id = :userId",
                    { postId, userId }
                );
            } else {
                await this.knex.raw(
                    "insert into post_likes (post_id,user_id) VALUES (:postId, :userId)",
                    { postId, userId }
                );
            }

            return { success: true, is_liked: !is_liked };
        } catch (error) {
            console.log(error);

            return { success: false, message: "Request failed." };
        }
    };
    getFollowedCompanies = async (userId: number) => {
        try {
            const followedCompanies = await this.knex("followed_companies")
                .select("*")
                .where("user_id", userId);
            return followedCompanies;
        } catch (error) {
            return false;
        }
    };

    // ELSA
    allUserList = async (name: any) => {
        try {
            let query = this.knex
                .select(
                    `users.id`,
                    `users.email`,
                    `users.first_name`,
                    `users.last_name`,
                    `users.phone`,
                    `users.avatar`,
                    `users.is_verified`
                )
                .from("users")
                .where("users.is_admin", false)
                .orderBy("users.id", "asc");
            if (name) {
                query = query.where("users.first_name", "ilike", `%${name}%`)
                    .orWhere("users.email", "ilike", `%${name}%`)
            }
            const allUser = await query;
            return {
                success: true,
                allUser,
            };
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    };

    getAllUserInfo = async (usersId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    ` select
                  users.id
                , users.email
                , users.gender
                , users.first_name
                , users.last_name
                , users.phone
                , users.birthday
                , users.address
                , users.avatar
                , users.banner
                , users.headline
                , users.introduction
                , users.experience
                , users.website
                , users.is_verified
                , users.is_activated
                , users.updated_at
                , cities.name as city
                , company_names.name as company
                , industries.name as industry
                , education.name as education
                , posts.content as posts
                , posts.updated_at as posts_updated_at
                , post_comments.content as post_comment
                , post_comments.updated_at as comment_updated_at
                , countries.name as user_countrie
                , user_hobbies.content as hobbie
                , user_skills.content as skill
                , job_categories.name as job_category
                from users
                left join cities on cities.id = users.city_id
                left join company_names on company_names.id = users.company_name_id
                left join industries on industries.id = users.industry_id
                left join education on education.id= users.education_id
                left join posts on posts.user_id = users.id
                left join post_comments on post_comments.user_id = users.id
                left join countries on countries.id = cities.country_id
                left join user_hobbies on user_hobbies.user_id = users.id
                left join user_skills on user_skills.user_id = users.id
                left join user_job_category on user_job_category.user_id = users.id
                left join job_categories on user_job_category.category_id = job_categories.id
                where users.id = ${usersId}`
                )
            ).rows[0];
            console.log("getAllUserInfo", result);
            // let post = await this.knex(users)
            return {
                success: true,
                data: result,
                usersId: usersId,
            };
        } catch (error) {
            console.log("getAllUserInfo, error:", error);
            return { success: false, message: error };
        }
    };

    allPostsList = async (q: any) => {
        try {
            let query = this.knex
                .select(
                    "posts.id",
                    "posts.content",
                    "posts.updated_at",
                    "company_names.name as comany_name",
                    "users.first_name as post_user_name",
                    "post_images.image as post_image",
                    "companies.is_verified as post_company_verified",
                    "users.is_verified as post_user_verified",
                    "users.avatar as post_user_icon",
                    "companies.avatar as post_company_icon",
                    "companies.id as post_company_id",
                    "users.id as post_user_id"
                )
                .from("posts")
                .leftJoin("companies", "companies.id", "posts.company_id")
                .leftJoin(
                    "company_names",
                    "company_names.id",
                    "companies.name_id"
                )
                .leftJoin("users", "users.id", "posts.user_id")
                .leftJoin("post_images", "post_images.id", "posts.id")
                .orderBy("posts.updated_at", "desc");
            if (q) {
                query = query.where("posts.content", "ilike", `${q}%`)
                    .orWhere("company_names.name", "ilike", `%${q}%`)
                    .orWhere("users.first_name", "ilike", `%${q}%`)
                    .orWhere("users.last_name", "ilike", `%${q}%`)
            }
            const allPosts = await query;
            return {
                success: true,
                allPosts,
            };
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    };

    getPostInfoById = async (postsId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    ` select
                posts.id 
                , posts.content 
                , posts.is_public 
                , posts.is_activated 
                , posts.updated_at 
                , post_images.image as post_image
                , company_names.name as company_name
                , companies.id as company_id
                , companies.avatar as company_avatar
                , concat(users.last_name, ' ', users.last_name) as user_name
                , users.id as user_id
                , users.avatar as user_avatar
                , post_comments.content as comment_content
                , post_comments.updated_at as comment_updated
                , companies.is_verified as post_company_verified
                , users.is_verified as post_user_verified
              from posts
              left join post_images on post_images.id = posts.id
              left join companies on companies.id = posts.company_id 
              left join company_names on company_names.id = companies.name_id 
              left join users on users.id = posts.user_id
              left join post_comments on post_comments.post_id = posts.id
              where posts.id = ${postsId}`
                )
            ).rows[0];
            console.log("getPostInfoById", result);

            return {
                success: true,
                data: result,
                postsId: postsId,
            };
        } catch (error) {
            console.log("getPostInfoById, error:", error);
            return { success: false, message: error };
        }
    };

    getPostByUser = async (userId: any) => {
        try {

            const query = (
                await this.knex.raw(
                    ` select users.id
                    , users.first_name 
                    , users.last_name
                    , users.avatar as user_avatar
                    , users.is_verified as user_verified
                    , posts.id as post_id
                    , posts.content as post_content
                    , posts.updated_at as post_updated
                    from users
                    inner join posts on posts.user_id = users.id
                    where users.id = ${userId}
                    order by post_updated desc`
                )
            ).rows;
            const allPosts = await query;
            console.log("getPostByUser", allPosts);
            return {
                success: true,
                allPosts,
                userId: userId,
            };
        } catch (error) {
            console.log("getPostByUser, error:", error);
            return { success: false, message: error };
        }
    };

    getLikeByPost = async (id: any) => {
        try {

            const query = (
                await this.knex.raw(
                    ` select post_likes.post_id
                    , post_likes.id as like_id
                    , post_likes.user_id 
                    , users.first_name as post_like_user_first_name
                    , users.last_name as post_like_user_last_name
                    , users.avatar as post_like_user_avatar
                    , users.is_verified as post_like_user_verified
                    , posts.content as post_content
                    , post_likes.updated_at as likes_updated
                    from post_likes
                    inner join posts on posts.id = post_likes.post_id
                    left join users on users.id = post_likes.user_id 
                    where post_id = ${id}
                    order by likes_updated desc`
                )
            ).rows;
            const allLikes = await query;
            console.log("getLikeByPost", allLikes);
            return {
                success: true,
                allLikes,
                id: id,
            };
        } catch (error) {
            console.log("getLikeByPost, error:", error);
            return { success: false, message: error };
        }
    };

    commentByPost = async (id: any) => {
        try {

            const query = (
                await this.knex.raw(
                    ` select post_comments.id
                    , post_comments.content 
                    , post_comments.user_id
                    , post_comments.post_id
                    , post_comments.updated_at 
                    , users.id as user_id
                    , users.first_name 
                    , users.last_name
                    , users.avatar as user_avatar
                    , users.is_verified as user_verified
                    from post_comments 
                    inner join posts on posts.id = post_comments.post_id
                    left join users on users.id = post_comments.user_id 
                    where post_id = ${id}
                    order by updated_at desc`
                )
            ).rows;
            const allComment = await query;
            console.log("commentByPost", allComment);
            return {
                success: true,
                allComment,
                id: id,
            };
        } catch (error) {
            console.log("commentByPost, error:", error);
            return { success: false, message: error };
        }
    };



    getUserInfo = async (userId: number) => {
        try {
            const result = (await this.knex.raw(
                "select * from users where id = :userId;",
                { userId }
            )).rows;
            return { success: true, result };
        } catch (error) {
            return false;
        }
    };

    async dashBoard() {
        try {
            let userYear = (await this.knex.raw(`select
            date_part('year', created_at) as year
          , count(*) as number_of_new_register_user
          from users
          group by date_part('year', created_at);`)).rows

            let companyYear = (await this.knex.raw(`select
                date_part('year', created_at) as year
              , count(*) as number_of_new_register_company
              from companies
              group by date_part('year', created_at);`)).rows


            let ownerYear = (await this.knex.raw(`select
            date_part('year', created_at) as year
          , count(*) as number_of_new_register_company_owner
          from company_owners
          group by date_part('year', created_at);`)).rows

            let postYear = (await this.knex.raw(`select
          to_char(created_at,'YYYY') as year
          , count(*) as number_of_new_register_post
          from posts
          where to_char(created_at,'YYYY') = to_char(NOW(),'YYYY')
          group by year
          order by year asc;`)).rows

            let userMonth = (await this.knex.raw(`select
          to_char(created_at,'MM') as month,
          count(*) as number_of_new_user_month
          from users
          group by month
          order by month asc;`)).rows

            let companyMonth = (await this.knex.raw(`select
          to_char(created_at,'MM') as month,
          count(*) as number_of_new_co_month
          from companies
          group by month
          order by month asc;`)).rows

            let postMonth = (await this.knex.raw(`select
          to_char(created_at,'MM') as month,
          count(*) as number_of_new_post_month
          from posts
          group by month
          order by month asc;`)).rows



            return {
                success: true,
                userYear,
                companyYear,
                ownerYear,
                postYear,
                userMonth,
                companyMonth,
                postMonth,

            };
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    };
}
