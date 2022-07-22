import socketIO from "socket.io";
import { onlineUsers } from "./conversation";
import { knex } from "./server";
import { User } from "./conversation";

export let io: socketIO.Server;
export let adminIo: socketIO.Namespace;

export function setSocketIO(value: socketIO.Server) {
    io = value;
    adminIo = io.of("admin");
    adminIo.on("connection", (socket) => {
        console.log("ADMIN", socket.id);
    });
    io.on("connection", async (socket) => {
        console.log("ALL SOCKETS", await io.allSockets());

        const { userId } = socket.handshake.auth; //number

        // Add user to online list
        let user: User = {
            userId: userId,
            socketId: socket.id,
        };

        if (userId) {
            console.log("SOCKET ID=>", socket.id);
            console.log("SOCKET USER ID=>", socket.handshake.auth.userId);
            onlineUsers.addUser(user);
            const roomIdList = (
                await knex("chatroom_users")
                    .where("user_id", userId)
                    .select("chatroom_id")
            ).map((obj) => obj.chatroom_id.toString());
            console.log(roomIdList);
            socket.join([...roomIdList, "111"]);
            if (roomIdList.length > 0) {
                socket.broadcast.emit("user-online", userId);
                // socket.to(roomIdList).emit("user-online", userId);
            }

            // EMIT ONLINE STATUS
            socket.broadcast.emit("status-online", userId);

            socket.on("read-message", async (roomId: number) => {
                // console.log("read-message", userId, roomId);
                // UPDATE READ STATUS TODO: Choose a better way
                if (userId && roomId) {
                    await knex.raw(
                        "update conversations set is_read = true where room_id = :roomId and sender_id != :userId;",
                        {
                            roomId,
                            userId,
                        }
                    );
                    io.to(roomId.toString()).emit(
                        "message-read",
                        userId,
                        roomId
                    );
                }
            });

            socket.on("join-room", (roomId) => {
                console.log("User", userId, "joined room", roomId);
                if (roomId && typeof roomId === "string") {
                    socket.join(roomId);
                } else if (roomId && typeof roomId === "number") {
                    socket.join(roomId.toString());
                }
            });
            // EMIT MESSAGE
            socket.on("typing", (userId, roomId) => {
                if (userId && roomId) {
                    socket.to(roomId.toString()).emit("typing", userId, roomId);
                }
            });

            socket.on("disconnect", async () => {
                console.log(socket.id, "LEFT");
                console.log(await io.allSockets());
                // onlineUsers.removeUserByUserId(userId);
                onlineUsers.removeUserBySocketId(socket.id);
                console.log(onlineUsers.userIdExist(userId));
                if (!onlineUsers.userIdExist(userId)) {
                    socket.broadcast.emit("user-offline", userId);
                }
                console.log("UserList", onlineUsers.list);
                // socket.to(roomIdList).emit("user-offline", userId);
                // const roomIdList = (
                //     await knex("chatroom_users")
                //         .where("user_id", userId)
                //         .select("chatroom_id")
                // ).map((obj) => obj.chatroom_id);

                // EMIT OFFLINE STATUS
            });
        }
    });
}
