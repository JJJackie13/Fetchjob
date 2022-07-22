import fs from "fs";
import path from "path";

import { Knex } from "knex";
import { NetworkService } from "./NetworkService";
import { UserService } from "./UserService";
import { Relationship } from "../enums/RelationshipEnum";
import { NotificationService } from "./NotificationService";

export class ThreadService {
    constructor(private knex: Knex) {}
    private getQuery = (
        connectionList: number[],
        companyList: number[]
    ): string => {
        const hasConnection = connectionList && connectionList.length > 0;
        const hasCompany = companyList && companyList.length > 0;
        const connectionQuery = `p.user_id in (${connectionList.join(",")})`;
        const companyQuery = `p.company_id in (${companyList.join(",")})`;
        if (hasConnection && hasCompany) {
            return `(${connectionQuery} OR ${companyQuery}) AND`;
        } else if (hasConnection && !hasCompany) {
            return `${connectionQuery} AND`;
        } else if (!hasConnection && hasCompany) {
            return `${companyQuery} AND`;
        } else {
            return "";
        }
    };
    // GET
    getAllConnectedThreadsByOffset = async (
        userId: number,
        offset: number = 0
    ) => {
        try {
            const networkService = new NetworkService(this.knex);
            const userService = new UserService(this.knex);
            const connections: { network_id: number; friend_id: number }[] =
                await networkService.getAllConnections(userId);
            const followedCompanies = await userService.getFollowedCompanies(
                userId
            );
            if (!connections || !followedCompanies) {
                return false;
            }
            const connectionList = connections.map((obj) => obj.friend_id);
            connectionList.push(userId);
            const companyList = followedCompanies.map((obj) => obj.company_id);
            const extraWhereClause = this.getQuery(connectionList, companyList);

            let data: any[] = [];

            if (connectionList.length === 0 && companyList.length === 0) {
                return { success: true, data };
            }

            let limit = 10;
            let totalOffset = offset * limit;

            const threads = (
                await this.knex.raw(
                    `select
                (select COUNT(*) from post_likes as pl where pl.post_id = p.id) as like_number,
                (select COUNT(*) from post_comments as pc where pc.post_id = p.id) as comment_number,
                (select COUNT(*) from followed_companies as fc where fc.company_id = c.id) as company_followers,
                (select COUNT(*) > 0 from post_likes as pl where pl.post_id = p.id and pl.user_id = :userId) as user_liked,
                p.id as id,
                p.user_id,
                u.first_name,
                u.last_name,
                u.headline,
                u.avatar as user_avatar,
                p.company_id,
                cn.name as company_name,
                c.avatar as company_avatar,
                p.content,
                p.is_public,
                p.created_at,
                p.updated_at
                FROM posts as p
                LEFT JOIN users as u on u.id = p.user_id
                LEFT JOIN companies as c on c.id = p.company_id
                LEFT JOIN company_names as cn on cn.id = c.name_id
                WHERE ${extraWhereClause}
                p.is_activated = true
                AND ((u.is_activated = true) OR (c.is_activated = true))
                ORDER BY p.created_at desc
                LIMIT ${limit}
                OFFSET ${totalOffset};
                `,
                    { userId }
                )
            ).rows;

            // console.log(threads);

            let postIdsArray: number[] = threads.map((thread: any) =>
                parseInt(thread.id)
            );
            // console.log(postIdsArray)
            const images = await this.getThreadImagesByIds(postIdsArray);
            if (!images) {
                return false;
            }
            data = threads.map((thread: any) => {
                thread.images = images
                    .filter((img) => img.post_id === thread.id)
                    .map((img) => {
                        return { id: img.id, path: img.image };
                    });
                return thread;
            });
            return { success: true, data };
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    getThreadByPostId = async (userId: number, postId: number) => {
        try {
            const threads = (
                await this.knex.raw(
                    `select
                (select COUNT(*) from post_likes as pl where pl.post_id = p.id) as like_number,
                (select COUNT(*) from post_comments as pc where pc.post_id = p.id) as comment_number,
                (select COUNT(*) from followed_companies as fc where fc.company_id = c.id) as company_followers,
                (select COUNT(*) > 0 from post_likes as pl where pl.post_id = p.id and pl.user_id = :userId) as user_liked,
                p.id as id,
                p.user_id,
                u.first_name,
                u.last_name,
                u.headline,
                u.avatar as user_avatar,
                p.company_id,
                cn.name as company_name,
                c.avatar as company_avatar,
                p.content,
                p.is_public,
                p.created_at,
                p.updated_at
                FROM posts as p
                LEFT JOIN users as u on u.id = p.user_id
                LEFT JOIN companies as c on c.id = p.company_id
                LEFT JOIN company_names as cn on cn.id = c.name_id
                WHERE p.id = :postId
                AND p.is_activated = true
                `,
                    { userId, postId }
                )
            ).rows;

            const commentsIds = await this.knex("post_comments as pc")
                .select("id")
                .where("pc.post_id", postId);
            let comments = [];
            if (commentsIds.length > 0) {
                let ids = commentsIds.map((obj: any) => obj.id).join(",");
                comments = (
                    await this.knex.raw(
                        `
                    SELECT
                    pc.id, 
                    null as subcomment_id,
                    pc.id as comment_id,
                    pc.user_id,
                    u.first_name,
                    u.last_name,
                    u.headline,
                    u.avatar,
                    content,
                    pc.created_at,
                    pc.updated_at,
                    (SELECT COUNT(*) FROM comment_likes as cl JOIN post_comments as pc2 ON cl.comment_id = pc2.id WHERE cl.comment_id = pc.id) as like_number,
                    (SELECT COUNT(*) FROM post_subcomments as ps JOIN post_comments as pc2 ON ps.comment_id = pc2.id WHERE ps.comment_id = pc.id) as reply_number,
                    (select COUNT(*) > 0 from comment_likes as cl where cl.comment_id = pc.id and cl.user_id = :userId) as user_liked
                    FROM post_comments as pc
                    JOIN users as u ON pc.user_id = u.id
                    WHERE pc.post_id = :postId
                    union
                    SELECT
                    ps.id, 
                    ps.id as subcomment_id,
                    ps.comment_id,
                    ps.user_id,
                    u.first_name,
                    u.last_name,
                    u.headline,
                    u.avatar,
                    content,
                    ps.created_at,
                    ps.updated_at,
                    (SELECT COUNT(*) FROM subcomment_likes as sl JOIN post_subcomments as ps2 ON sl.subcomment_id = ps2.id WHERE sl.subcomment_id = ps.id) as like_number,
                    null as reply_number,
                    (select COUNT(*) > 0 from subcomment_likes as sl where sl.subcomment_id = ps.id and ps.user_id = :userId) as user_liked
                    FROM post_subcomments as ps
                    JOIN users as u ON ps.user_id = u.id
                    WHERE ps.comment_id in (${ids})
                    ORDER by comment_id desc, subcomment_id asc nulls first, created_at desc
            `,
                        { postId, userId }
                    )
                ).rows;
            }

            // ORDER IS "HARDCODE(?)"

            // const comments = (
            //     await this.knex.raw(
            //         `
            // SELECT
            // pc.id,
            // pc.user_id,
            // u.first_name,
            // u.last_name,
            // u.headline,
            // u.avatar,
            // content,
            // pc.created_at,
            // pc.updated_at,
            // (SELECT COUNT(*) FROM comment_likes as cl JOIN post_comments as pc ON cl.comment_id = pc.id WHERE pc.post_id = :postId) as like_number,
            // (SELECT COUNT(*) FROM comment_likes as cl JOIN post_comments as pc ON cl.comment_id = pc.id WHERE pc.post_id = :postId) as reply_number,
            // (select COUNT(*) > 0 from comment_likes as cl where cl.comment_id = pc.id and cl.user_id = :userId) as user_liked
            // FROM post_comments as pc
            // JOIN users as u ON pc.user_id = u.id
            // WHERE post_id = :postId
            // ORDER BY pc.created_at desc
            // `,
            //         { postId, userId }
            //     )
            // ).rows;
            // console.log(comments);

            const images = await this.getThreadImagesByIds([threads[0].id]);
            if (!images) {
                return false;
            }
            const post = threads.map((thread: any) => {
                thread.images = images
                    .filter((img) => img.post_id === thread.id)
                    .map((img) => {
                        return { id: img.id, path: img.image };
                    });
                return thread;
            });
            return { success: true, data: { post: post[0], comments } };
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    getAllThreadsByPosterId = async (
        userId: number,
        posterId: number,
        type: any
    ) => {
        //   ONLY FRIEND's POST
        try {
            const networkService = new NetworkService(this.knex);
            const relationship = await networkService.getRelationshipById(
                userId,
                posterId
            );
            const privatePostQuery =
                userId !== posterId && relationship !== Relationship.FRIEND
                    ? `AND p.is_public = true`
                    : "";
            const threads = (
                await this.knex.raw(
                    `select
                (select COUNT(*) from post_likes as pl where pl.post_id = p.id) as like_number,
                (select COUNT(*) from post_comments as pc where pc.post_id = p.id) as comment_number,
                (select COUNT(*) from followed_companies as fc where fc.company_id = c.id) as company_followers,
                (select COUNT(*) > 0 from post_likes as pl where pl.post_id = p.id and pl.user_id = :userId) as user_liked,
                p.id as id,
                p.user_id,
                u.first_name,
                u.last_name,
                u.headline,
                u.avatar as user_avatar,
                p.company_id,
                cn.name as company_name,
                c.avatar as company_avatar,
                p.content,
                p.is_public,
                p.created_at,
                p.updated_at
                FROM posts as p
                LEFT JOIN users as u on u.id = p.user_id
                LEFT JOIN companies as c on c.id = p.company_id
                LEFT JOIN company_names as cn on cn.id = c.name_id
                WHERE ${
                    type === "user" ? "p.user_id" : "p.company_id"
                } = :posterId
                AND p.is_activated = true
                ${privatePostQuery}
                ORDER BY p.created_at desc;
                `,
                    { userId, posterId }
                )
            ).rows;

            // console.log(threads);
            let postIdsArray: number[] = threads.map((thread: any) =>
                parseInt(thread.id)
            );
            const images = await this.getThreadImagesByIds(postIdsArray);
            if (!images) {
                return false;
            }

            const data = threads.map((thread: any) => {
                thread.images = images
                    .filter((img) => img.post_id === thread.id)
                    .map((img) => {
                        return { id: img.id, path: img.image };
                    });
                return thread;
            });
            return data;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    getThreadImagesByIds = async (postIdsArray: number[]) => {
        try {
            const imagesData = await this.knex("post_images")
                .select("*")
                .whereIn("post_id", postIdsArray);
            return imagesData;
        } catch (error) {
            return false;
        }
    };
    // POST
    postUserThread = async (
        userId: number,
        userName: string,
        files: any,
        content: string,
        is_public: boolean
    ) => {
        try {
            const notificationService = new NotificationService(this.knex);
            await this.knex.transaction(async (trx) => {
                const postData = {
                    user_id: userId,
                    content: content,
                    is_public,
                };
                const postId = (
                    await trx("posts").insert(postData).returning("id")
                )[0];
                if (files) {
                    for (let i = 0; i < files.length; i++) {
                        const image = files[i]["filename"];
                        const newPostImg = {
                            post_id: postId,
                            image,
                        };
                        await trx("post_images").insert(newPostImg);
                        if (
                            fs.existsSync(path.resolve("./uploads/temp", image))
                        ) {
                            fs.renameSync(
                                path.resolve("./uploads/temp", image),
                                path.resolve("./uploads/thread", image)
                            );
                        }
                    }
                }
                notificationService.createUserThreadNotifications(
                    userId,
                    postId,
                    userName,
                    content
                );
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const image = files[i]["filename"];
                    if (fs.existsSync(path.resolve("./uploads/temp", image))) {
                        fs.unlinkSync(path.resolve("./uploads/temp", image));
                    }
                }
            }
        }
    };
    postCompanyThread = async (
        userId: number,
        companyId: number,
        files: any,
        content: string,
        is_public: boolean
    ) => {
        try {
            const notificationService = new NotificationService(this.knex);
            await this.knex.transaction(async (trx) => {
                let companyName = "";
                let name = (
                    await trx("companies as c")
                        .join("company_names as cn", "c.name_id", "cn.id")
                        .select("cn.name")
                        .where("c.id", companyId)
                )[0].name;
                if (name) {
                    companyName = name;
                }
                const postData = {
                    company_id: companyId,
                    content: content,
                    is_public,
                };
                const postId = (
                    await trx("posts").insert(postData).returning("id")
                )[0];
                if (files) {
                    for (let i = 0; i < files.length; i++) {
                        const image = files[i]["filename"];
                        const newPostImg = {
                            post_id: postId,
                            image,
                        };
                        await trx("post_images").insert(newPostImg);
                        if (
                            fs.existsSync(path.resolve("./uploads/temp", image))
                        ) {
                            fs.renameSync(
                                path.resolve("./uploads/temp", image),
                                path.resolve("./uploads/thread", image)
                            );
                        }
                    }
                }
                notificationService.createCompanyThreadNotifications(
                    companyId,
                    postId,
                    companyName,
                    content
                );
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const image = files[i]["filename"];
                    if (fs.existsSync(path.resolve("./uploads/temp", image))) {
                        fs.unlinkSync(path.resolve("./uploads/temp", image));
                    }
                }
            }
        }
    };
    postComment = async (userId: number, post_id: number, content: string) => {
        try {
            await this.knex("post_comments").insert({
                user_id: userId,
                post_id,
                content,
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    postSubcomment = async (
        userId: number,
        comment_id: number,
        content: string
    ) => {
        try {
            await this.knex("post_subcomments").insert({
                user_id: userId,
                comment_id,
                content,
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    // PUT
    editUserThread = async (
        postId: number,
        files: any,
        content: string,
        is_public: boolean
    ) => {
        try {
            const oldImages = await this.getThreadImagesByIds([postId]);
            await this.knex.transaction(async (trx) => {
                const postData = {
                    content: content,
                    is_public,
                    updated_at: this.knex.fn.now(),
                };
                await trx("posts").update(postData).where("id", postId);
                if (files) {
                    for (let i = 0; i < files.length; i++) {
                        const image = files[i]["filename"];
                        const newPostImg = {
                            post_id: postId,
                            image,
                        };
                        await trx("post_images").insert(newPostImg);

                        if (
                            fs.existsSync(path.resolve("./uploads/temp", image))
                        ) {
                            fs.renameSync(
                                path.resolve("./uploads/temp", image),
                                path.resolve("./uploads/thread", image)
                            );
                        }
                    }
                }
                if (oldImages) {
                    let oldImagesIds = oldImages.map((obj) => obj.id);
                    await trx("post_images").whereIn("id", oldImagesIds).del();
                }
            });
            if (oldImages) {
                for (let i = 0; i < oldImages.length; i++) {
                    let imgPath = oldImages[i].path;
                    if (
                        imgPath &&
                        fs.existsSync(path.resolve("./uploads/thread", imgPath))
                    ) {
                        fs.unlinkSync(
                            path.resolve("./uploads/thread", imgPath)
                        );
                    }
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const image = files[i]["filename"];
                    if (fs.existsSync(path.resolve("./uploads/temp", image))) {
                        fs.unlinkSync(path.resolve("./uploads/temp", image));
                    }
                }
            }
        }
    };
    likePost = async (userId: number, postId: number) => {
        try {
            const isLiked =
                (
                    await this.knex("post_likes")
                        .select("*")
                        .where("post_id", postId)
                        .andWhere("user_id", userId)
                ).length > 0;
            if (isLiked) {
                await this.knex("post_likes")
                    .where("post_id", postId)
                    .andWhere("user_id", userId)
                    .del();
            } else {
                await this.knex("post_likes").insert({
                    post_id: postId,
                    user_id: userId,
                });
            }
            return true;
        } catch (error) {
            return false;
        }
    };
    likeComment = async (userId: number, commentId: number) => {
        try {
            const isLiked =
                (
                    await this.knex("comment_likes")
                        .select("*")
                        .where("comment_id", commentId)
                        .andWhere("user_id", userId)
                ).length > 0;
            if (isLiked) {
                await this.knex("comment_likes")
                    .where("comment_id", commentId)
                    .andWhere("user_id", userId)
                    .del();
            } else {
                await this.knex("comment_likes").insert({
                    comment_id: commentId,
                    user_id: userId,
                });
            }
            return true;
        } catch (error) {
            return false;
        }
    };
    likeSubcomment = async (userId: number, subcommentId: number) => {
        try {
            const isLiked =
                (
                    await this.knex("subcomment_likes")
                        .select("*")
                        .where("subcomment_id", subcommentId)
                        .andWhere("user_id", userId)
                ).length > 0;
            if (isLiked) {
                await this.knex("subcomment_likes")
                    .where("subcomment_id", subcommentId)
                    .andWhere("user_id", userId)
                    .del();
            } else {
                await this.knex("subcomment_likes").insert({
                    subcomment_id: subcommentId,
                    user_id: userId,
                });
            }
            return true;
        } catch (error) {
            console.log("likeSubcomment", error);
            return false;
        }
    };
    deleteUserPost = async (userId: number, postId: number) => {
        try {
            const relatedPostImages = await this.getThreadImagesByIds([postId]);
            if (!relatedPostImages) {
                return false;
            }
            // console.log(relatedPostImages);
            await this.knex("posts")
                .where("user_id", userId)
                .andWhere("id", postId)
                .del();

            relatedPostImages.forEach((obj) => {
                let imgPath = obj.image;
                if (
                    imgPath &&
                    fs.existsSync(path.resolve("./uploads/thread", imgPath))
                ) {
                    fs.unlinkSync(path.resolve("./uploads/thread", imgPath));
                }
            });

            return true;
        } catch (error) {
            console.log("deleteUserPost=>", error);
            return false;
        }
    };
}
