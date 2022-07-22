import { Request, Response } from "express";
import { ChatBotService } from "../services/ChatBotService";

export class ChatBotController {
    constructor(private chatbotService: ChatBotService) {}

    // getJobByIndustryAndSalary = async (req: Request, res: Response) => {
    //     //let result:any[] = [];
    //     console.log("ChatBotSendingReqForFindingJob");
    //     const key1: any = req.query.keywords;
    //     //const key2: any = req.query.keywords;
    //     const result = await this.chatbotService.getJobSearchRes(key1);
    //     //const result2 = await this.ChatBotService.getUserSearchRes(key2);
    //     console.log("Result:", result);
    //     res.json(result);
    // };

    getStaffByEducationByIndustryByWorkExp = async (
        req: Request,
        res: Response
    ) => {
        console.log("ChatBotSendingReqForFindingStaff");
        const education: any = req.query.keywords;
        const industry: any = req.query.keywords;
        const experience: any = req.query.keywords;
        const result = await this.chatbotService.getStaffSearchRes(
            education,
            industry,
            experience
        );
        console.log("Result:", result);
        res.json(result);
    };
}
