import express from "express";
import { ChatBotController } from "../controllers/ChatbotController";

import { multerEmpty } from "../multer";

export const chatbotRoutes = express.Router();

chatbotRoutes.get("/userFindJob", ChatBotController.getJobByIndustryAndSalary);
chatbotRoutes.get(
    "/companyFindStaff",
    ChatBotController.getStaffByEducationByIndustryByWorkExp
);
