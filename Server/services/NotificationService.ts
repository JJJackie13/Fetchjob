import { Knex } from "knex";
import { NetworkService } from "./NetworkService";
import { NotificationType } from "../enums/enums";
import { io } from "../socketio";
import { onlineUsers } from "../conversation";
import { CompanyService } from "./CompanyService";

export class NotificationService {
    constructor(private knex: Knex) {}
    getNotificationTypes = async () => {
        try {
            const result = await this.knex("notification_types as nt").select(
                "*"
            );

            return result;
        } catch (error) {
            console.log("getNotificationTypes", error);
            return false;
        }
    };
    getNotifications = async (userId: number) => {
        try {
            const result = await this.knex("notifications as n")
                .join("notification_types as nt", "n.type_id", "nt.id")
                .select("*", "n.id", "n.created_at", "n.updated_at")
                .where("n.user_id", userId)
                .orderBy("n.created_at", "desc");
            return result;
        } catch (error) {
            console.log("getNotifications", error);
            return false;
        }
    };
    readNotifications = async (userId: number) => {
        try {
            await this.knex("notifications")
                .update("is_read", true)
                .where("user_id", userId);
            return true;
        } catch (error) {
            console.log("readNotifications", error);
            return false;
        }
    };
    createUserThreadNotifications = async (
        userId: number,
        postId: number,
        posterName: string,
        content: string
    ) => {
        try {
            const networkService = new NetworkService(this.knex);
            const notificationTypes = await this.getNotificationTypes();
            if (!notificationTypes) {
                return false;
            }
            const notificationTypeId = notificationTypes.filter(
                (obj: any) => obj.name === NotificationType.NEWPOST
            )[0].id;
            const connectionsIds = (
                await networkService.getAllConnections(userId)
            ).map((obj: any) => obj.friend_id);
            const newNotifications = connectionsIds.map(
                (id: string | number) => {
                    return {
                        user_id: id,
                        primary_id: postId,
                        type_id: notificationTypeId,
                        content: `${posterName} created a new post:\n${content}`,
                        is_read: false,
                    };
                }
            );
            const result = await this.knex("notifications")
                .insert(newNotifications)
                .returning("*");

            for (let i = 0; i < result.length; i++) {
                const targetUser = result[i].user_id;
                const socketIds = onlineUsers.getSocketIdsByUserId(targetUser);
                const message = result[i];
                // console.log(message);
                if (socketIds) {
                    socketIds.forEach((id: string) =>
                        io.to(`${id}`).emit("notification", {
                            ...message,
                            name: NotificationType.NEWPOST,
                        })
                    );
                }
            }

            return true;
        } catch (error) {
            console.log("getNotifications", error);
            return false;
        }
    };
    createCompanyThreadNotifications = async (
        companyId: number,
        postId: number,
        posterName: string,
        content: string
    ) => {
        try {
            const companyService = new CompanyService(this.knex);
            const notificationTypes = await this.getNotificationTypes();
            if (!notificationTypes) {
                return false;
            }
            const notificationTypeId = notificationTypes.filter(
                (obj: any) => obj.name === NotificationType.NEWPOST
            )[0].id;
            let followerIds = await companyService.getCompanyFollowers(
                companyId
            );

            if (followerIds) {
                followerIds = followerIds.map((obj: any) => obj.user_id);
                const newNotifications = followerIds.map(
                    (id: string | number) => {
                        return {
                            user_id: id,
                            primary_id: postId,
                            type_id: notificationTypeId,
                            content: `${posterName} created a new post:\n${content}`,
                            is_read: false,
                        };
                    }
                );
                const result = await this.knex("notifications")
                    .insert(newNotifications)
                    .returning("*");

                for (let i = 0; i < result.length; i++) {
                    const targetUser = result[i].user_id;
                    const socketIds =
                        onlineUsers.getSocketIdsByUserId(targetUser);
                    const message = result[i];
                    // console.log(message);
                    if (socketIds) {
                        socketIds.forEach((id: string) =>
                            io.to(`${id}`).emit("notification", {
                                ...message,
                                name: NotificationType.NEWPOST,
                            })
                        );
                    }
                }
            }

            return true;
        } catch (error) {
            console.log("getNotifications", error);
            return false;
        }
    };
    deleteNotification = async (id: number) => {
        try {
            await this.knex("notifications").where("id", id).del();
            return true;
        } catch (error) {
            console.log("deleteNotification", error);
            return false;
        }
    };
}
