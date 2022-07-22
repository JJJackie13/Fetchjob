import { Knex } from "knex";
// import { logger } from "../logger";
import { io } from "../server";
import { onlineUsers } from "../conversation";
import { IMessage } from "../types";

export class ChatService {
    constructor(private knex: Knex) {}
    getAllChatHistory = async (userId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    `select
                    c.id as conversation_id,
                    c.room_id as room_id, 
                    c.sender_id, 
                    (select u.avatar as sender_avatar from users as u where u.id = c.sender_id), 
                    (select u.first_name || ' ' || u.last_name as sender_name from users as u where u.id = c.sender_id), 
                    content, 
                    c.is_sent, 
                    c.is_received, 
                    c.is_read, 
                    c.created_at,
                    (select cu.user_id from chatroom_users as cu where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_id,
                    (select u.first_name || ' ' || u.last_name from chatroom_users as cu join users as u on u.id = cu.user_id where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_name,
                    (select u.avatar from chatroom_users as cu join users as u on u.id = cu.user_id where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_avatar
                    from users as u 
                    join chatroom_users as cu on u.id = cu.user_id 
                    left join conversations as c on c.room_id = cu.chatroom_id 
                    where cu.chatroom_id in (select chatroom_id from chatroom_users as cu where cu.user_id = :userId) and u.id != :userId order by c.room_id ,c.created_at desc;`,
                    { userId }
                )
            ).rows;
            return result;
        } catch (error) {
            console.log("allchat", error);
            return false;
        }
    };
    getAllUsersForChatByKeyword = async (userId: number, keyword: any) => {
        try {
            const result = (
                await this.knex.raw(
                    `select u.id as userid, u.first_name, u.last_name, u.avatar, u.headline, 
                    (select cu.chatroom_id 
                    from users as u1
                    join chatroom_users as cu on u1.id = cu.user_id 
                    where cu.user_id = u.id 
                    intersect 
                    select cu.chatroom_id 
                    from users as u2
                    join chatroom_users as cu on u2.id = cu.user_id 
                    where cu.user_id = :userId) 
                    from users as u where u.id != :userId and (u.first_name ilike '%${keyword}%' or u.last_name ilike '%${keyword}%');`,
                    { userId }
                )
            ).rows;
            return result;
        } catch (error) {
            console.log("getAllUsersForChatByKeyword", error);
            return false;
        }
    };
    getChatHistoryByRoomId = async (userId: number, roomId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    `select
                    c.id as conversation_id,
                    c.room_id as room_id, 
                    c.sender_id, 
                    (select u.avatar as sender_avatar from users as u where u.id = c.sender_id), 
                    (select u.first_name || ' ' || u.last_name as sender_name from users as u where u.id = c.sender_id), 
                    content, 
                    c.is_sent, 
                    c.is_received, 
                    c.is_read, 
                    c.created_at,
                    (select cu.user_id from chatroom_users as cu where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_id,
                    (select u.first_name || ' ' || u.last_name from chatroom_users as cu join users as u on u.id = cu.user_id where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_name,
                    (select u.avatar from chatroom_users as cu join users as u on u.id = cu.user_id where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_avatar
                    from users as u 
                    join chatroom_users as cu on u.id = cu.user_id 
                    left join conversations as c on c.room_id = cu.chatroom_id 
                    where cu.chatroom_id = :roomId 
                    and u.id != :userId 
                    order by c.room_id ,c.created_at desc;`,
                    { userId, roomId }
                )
            ).rows;
            return result;
        } catch (error) {
            console.log("allchat", error);
            return false;
        }
    };
    receivedMessages = async (userId: number) => {
        try {
            // UPDATE receive STATUS
            const roomIdList = await this.getRoomIdByUser(userId);
            if (!roomIdList) {
                return false;
            }
            if (roomIdList.length > 0) {
                const roomIdListQuery = roomIdList.join(",");

                const updatedChats = (
                    await this.knex.raw(
                        `update conversations set is_received = true where room_id in (${roomIdListQuery}) and sender_id != :userId and is_sent = true and is_received = false returning id, room_id;`,
                        {
                            userId,
                        }
                    )
                ).rows;
                // console.log("updatedChats", updatedChats);
                const formatedpdatedChats = updatedChats.reduce(
                    (acc: any, cur: { id: string; room_id: string }) => {
                        let roomId = cur.room_id;
                        let conversationId = cur.id;
                        if (!acc[roomId]) {
                            acc[roomId] = [conversationId];
                        } else {
                            acc[roomId].push(conversationId);
                        }
                        return acc;
                    },
                    {}
                );

                // console.log("formatedpdatedChats", formatedpdatedChats);
                for (
                    let i = 0;
                    i < Object.keys(formatedpdatedChats).length;
                    i++
                ) {
                    io.to(Object.keys(formatedpdatedChats)[i]).emit(
                        "message-received",
                        formatedpdatedChats[Object.keys(formatedpdatedChats)[i]]
                    );
                }
            }

            return true;
        } catch (error) {
            console.log("receivedMessages", error);
            return false;
        }
    };
    getAllLastChatHistory = async (userId: number) => {
        try {
            let result = (
                await this.knex.raw(
                    `select distinct on (c.room_id) 
                    c.room_id as room_id, 
                    c.sender_id, 
                    (select u.avatar as sender_avatar from users as u where u.id = c.sender_id), 
                    (select u.first_name || ' ' || u.last_name as sender_name from users as u where u.id = c.sender_id), 
                    content, 
                    c.is_sent, 
                    c.is_received, 
                    c.is_read, 
                    c.created_at,
                    (select cu.user_id from chatroom_users as cu where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_id,
                    (select u.first_name || ' ' || u.last_name from chatroom_users as cu join users as u on u.id = cu.user_id where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_name,
                    (select u.avatar from chatroom_users as cu join users as u on u.id = cu.user_id where cu.user_id !=:userId and cu.chatroom_id = c.room_id) as counterpart_avatar
                    from users as u 
                    join chatroom_users as cu on u.id = cu.user_id 
                    left join conversations as c on c.room_id = cu.chatroom_id 
                    where cu.chatroom_id in (select chatroom_id from chatroom_users as cu where cu.user_id = :userId) and u.id != :userId order by c.room_id ,c.created_at desc;`,
                    { userId }
                )
            ).rows;
            const roomList = result.map((list: any) => list.roomId);
            if (roomList.length > 0) {
                let unreadMessages = (
                    await this.knex.raw(
                        `
                select count(*) as unread_number, cr.id as room_Id from conversations as c 
                join chatrooms as cr on c.room_id = cr.id 
                join chatroom_users as cu on cr.id = cu.chatroom_id 
                where c.sender_id != :userId and cu.user_id = :userId and c.is_read = false 
                group by cr.id
                `,
                        { userId }
                    )
                ).rows;
                result = result.reduce((acc: any, cur: any) => {
                    let unreadNumber = unreadMessages.filter(
                        (n: any) => n.room_id === cur.room_id
                    );
                    acc.push({
                        ...cur,
                        unread_number:
                            unreadNumber.length > 0
                                ? unreadNumber[0].unread_number
                                : 0,
                    });
                    return acc;
                }, []);
            }

            const finalResult = result.map((obj: {}) => {
                obj["is_online"] = onlineUsers.userIdExist(
                    parseInt(obj["counterpart_id"])
                );
                return obj;
            });
            // console.log("result", finalResult);
            return finalResult;
        } catch (error) {
            console.log("getAllLastChatHistory=>", error);
            return false;
        }
    };
    sendMessage = async (
        userId: number,
        userName: string,
        roomId: number | undefined,
        counterpartId: number | undefined,
        message: IMessage
    ) => {
        try {
            let room_id = roomId;
            if (!roomId) {
                if (!counterpartId) {
                    return false;
                }
                let newRoomName = [userId, counterpartId]
                    .sort((a, b) => a - b)
                    .join("--rm--");
                let roomExisted = await this.knex("chatrooms")
                    .select("*")
                    .where("name", newRoomName);
                if (roomExisted.length === 0) {
                    await this.knex.transaction(async (trx) => {
                        room_id = (
                            await trx("chatrooms")
                                .insert({
                                    name: newRoomName,
                                })
                                .returning("id")
                        )[0];
                        console.log("ROOM CREATED =>", room_id);
                        await trx("chatroom_users").insert([
                            {
                                chatroom_id: room_id,
                                user_id: userId,
                            },
                            {
                                chatroom_id: room_id,
                                user_id: counterpartId,
                            },
                        ]);

                        const conversation = (
                            await trx("conversations")
                                .insert({
                                    sender_id: userId,
                                    content: message.text,
                                    room_id: room_id,
                                })
                                .returning("*")
                        )[0];

                        let newMessage = {
                            ...message,
                            _id: conversation.id,
                            is_sent: true,
                            createdAt: new Date(conversation.created_at),
                        };

                        let counterpartSocketIds =
                            onlineUsers.getSocketIdsByUserId(counterpartId);

                        let currentUserSocketIds =
                            onlineUsers.getSocketIdsByUserId(userId);

                        if (counterpartSocketIds) {
                            counterpartSocketIds.forEach((id) => {
                                if (id) {
                                    io.to(id).emit(
                                        "new-message",
                                        room_id,
                                        userName,
                                        newMessage
                                    );
                                    io.to(id).emit("update-lastchat");
                                }
                            });
                        }
                        if (currentUserSocketIds) {
                            currentUserSocketIds.forEach((id) => {
                                if (id) {
                                    io.to(id).emit(
                                        "new-message",
                                        room_id,
                                        userName,
                                        newMessage
                                    );
                                    io.to(id).emit("update-lastchat");
                                }
                            });
                        }

                        return {
                            conversation_id: conversation.id,
                            room_id: room_id,
                        };
                    });
                } else {
                    room_id = roomExisted[0].id;
                }
            }

            const conversation = (
                await this.knex("conversations")
                    .insert({
                        sender_id: userId,
                        content: message.text,
                        room_id: room_id,
                    })
                    .returning("*")
            )[0];

            let newMessage = {
                ...message,
                _id: conversation.id,
                is_sent: true,
                createdAt: new Date(conversation.created_at),
            };

            io.to(room_id!.toString()).emit(
                "message",
                room_id,
                userName,
                newMessage
            );
            io.to(room_id!.toString()).emit("update-lastchat");

            return { conversation_id: conversation.id, room_id: room_id };
        } catch (error) {
            console.log("SEND MESSAGE", error);
            return false;
        }
    };
    getRoomIdByUser = async (userId: number) => {
        try {
            const roomIdList = (
                await this.knex("chatroom_users")
                    .where("user_id", userId)
                    .select("chatroom_id")
            ).map((obj) => obj.chatroom_id);
            return roomIdList;
        } catch (error) {
            console.log("getRoomIdByuser=>", error);
            return false;
        }
    };
}
