import { Request, Response } from "express";
import { ReportService } from "../services/ReportService";

export class ReportController {
    constructor(private reportService: ReportService) { }
    reportPost = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const postId = parseInt(req.params.id);
        const { typeId, remark } = req.body;
        if (!postId || !typeId) {
            return res.status(401).json({ message: "Invalid input" });
        }
        const result = await this.reportService.reportPost(
            userId,
            postId,
            parseInt(typeId),
            remark
        );
        if (result) {
            return res.json();
        } else {
            return res.status(400).json({ message: "Request failed" });
        }
    };
    reportUser = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const targetUserId = parseInt(req.params.id);
        const { typeId, remark } = req.body;
        if (!targetUserId || !typeId) {
            return res.status(401).json({ message: "Invalid input" });
        }
        const result = await this.reportService.reportUser(
            userId,
            targetUserId,
            parseInt(typeId),
            remark
        );
        if (result) {
            return res.json();
        } else {
            return res.status(400).json({ message: "Request failed" });
        }
    };
    reportCompany = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        const { typeId, remark } = req.body;
        if (!companyId || !typeId) {
            return res.status(401).json({ message: "Invalid input" });
        }
        const result = await this.reportService.reportCompany(
            userId,
            companyId,
            parseInt(typeId),
            remark
        );
        if (result) {
            return res.json();
        } else {
            return res.status(400).json({ message: "Request failed" });
        }
    };

    //elsa
    repoByPostId = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const result = await this.reportService.repoByPostId(id);
        console.log("result:", result)
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(400).json(result);
        }
    };




}
