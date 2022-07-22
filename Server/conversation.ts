export interface User {
    userId?: number;
    socketId?: string;
}
// export let onlineList: User[] = [];

class onlineList {
    list: User[];
    constructor() {
        this.list = [];
    }
    addUser = async (user: User) => {
        this.list.push(user);
        console.log("JOINED", this.list);
    };
    userIdExist(userId: number) {
        return this.list.some((obj) => obj.userId === userId);
    }
    getUserIdBySocketId(socketId: string) {
        const target = this.list.filter(
            (item) => item.socketId === socketId
        )[0];
        // console.log(target);
        if (target) {
            return target.userId;
        } else {
            return false;
        }
    }
    getSocketIdsByUserId(userId: number) {
        const targets = this.list
            .filter((item) => item.userId == userId)
            .map((item) => item.socketId);
        // console.log(target);
        if (targets && targets.length > 0) {
            return targets;
        } else {
            return false;
        }
    }
    removeUserBySocketId(socketId: string) {
        this.list = this.list.filter((obj) => obj.socketId !== socketId);
    }
    removeUserByUserId(userId: number) {
        this.list = this.list.filter((obj) => obj.userId !== userId);
        console.log("LEFT", this.list);
    }
}

export const onlineUsers = new onlineList();
