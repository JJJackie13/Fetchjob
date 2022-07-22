import { Request, Response } from "express";
import { ChatService } from "../services/ChatService";

export class ChatController {
    constructor(private chatService: ChatService) {}
    getAllChatHistory = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const success = await this.chatService.receivedMessages(userId);
        if (!success) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
        const result = await this.chatService.getAllChatHistory(userId);
        if (result) {
            return res.json({ data: result });
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getAllUsersForChatByKeyword = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        let keyword = req.query.keyword;
        if (!req.query || !req.query.keyword) {
            keyword = "";
        }
        // console.log(id, userId);
        const result = await this.chatService.getAllUsersForChatByKeyword(
            userId,
            keyword
        );
        if (result) {
            return res.json({ data: result });
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getChatHistoryByRoomId = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalid query" });
        }
        const result = await this.chatService.getChatHistoryByRoomId(
            userId,
            parseInt(id)
        );
        const success = await this.chatService.receivedMessages(userId);
        if (!success) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
        if (result) {
            return res.json({ data: result });
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getAllLastChatHistory = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const result = await this.chatService.getAllLastChatHistory(userId);
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    sendMessage = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const userName = req["user"].first_name + " " + req["user"].last_name;
        const { roomId, counterpartId, message } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Invalid input" });
        }
        if (!roomId && !counterpartId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        // console.log(roomId, message, counterpartId);
        let room_id = roomId ? parseInt(roomId) : undefined;
        const result = await this.chatService.sendMessage(
            userId,
            userName,
            room_id,
            counterpartId,
            message
        );
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Request failed" });
        }
    };
}
