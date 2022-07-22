import express from "express";
import { chatController } from "../server";
import { isAuth } from "../middlewares/auth";

export const chatRoutes = express.Router();

chatRoutes.get("/history/:id", isAuth, chatController.getAllChatHistory);
chatRoutes.get("/connect", isAuth, chatController.getAllLastChatHistory);
chatRoutes.post("/send", isAuth, chatController.sendMessage);
