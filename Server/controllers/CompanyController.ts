import { Request, Response } from "express";
import { CompanyService } from "../services/CompanyService";
// import { Controller, HttpError } from './Admincontroller'

export class CompanyController {
    constructor(private companyService: CompanyService) {}
    getCompanyById = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        let companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Invalid id" });
        }
        const result = await this.companyService.getCompanyById(
            userId,
            companyId
        );
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };

    deleteCompany = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const ownedCompanies = await this.companyService.getOwnedCompanies(
            userId
        );
        if (
            ownedCompanies &&
            !ownedCompanies.data.some((obj: any) => obj.company_id == companyId)
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const success = await this.companyService.deleteBanner(companyId);
        if (success) {
            return res.json(true);
        } else {
            return res
                .status(400)
                .json({ message: "Failed to delete avatar." });
        }
    };

    editBasicInfo = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        const data = req.body;
        if (!companyId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const ownedCompanies = await this.companyService.getOwnedCompanies(
            userId
        );
        if (
            ownedCompanies &&
            !ownedCompanies.data.some((obj: any) => obj.company_id == companyId)
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const success = await this.companyService.editBasicInfo(
            companyId,
            data
        );
        if (success) {
            return res.json({ message: "Successfully updated." });
        } else {
            return res
                .status(404)
                .json({ message: "Failed to update profile." });
        }
    };
    getOwnedCompanies = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const result = await this.companyService.getOwnedCompanies(userId);
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getAllTypes = async (req: Request, res: Response) => {
        const result = await this.companyService.getAllTypes();
        res.json(result);
    };

    getMasterByUserAndCompanyId = async (req: Request, res: Response) => {
        const userId = parseInt(req.session["userId"]);
        const companyId = parseInt(req.params.id);

        const result = await this.companyService.getMasterByUserAndCompanyId(
            userId,
            companyId
        );
        res.json(result);
    };
    getAllCompanyInfo = async (req: Request, res: Response) => {
        const result = await this.companyService.getAllCompanyInfo();
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json({ message: "Failed to retrieve data." });
        }
    };
    deleteAvatar = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const ownedCompanies = await this.companyService.getOwnedCompanies(
            userId
        );
        if (
            ownedCompanies &&
            !ownedCompanies.data.some((obj: any) => obj.company_id == companyId)
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const success = await this.companyService.deleteAvatar(companyId);
        if (success) {
            return res.json(true);
        } else {
            return res
                .status(400)
                .json({ message: "Failed to delete avatar." });
        }
    };
    deleteBanner = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const ownedCompanies = await this.companyService.getOwnedCompanies(
            userId
        );
        if (
            ownedCompanies &&
            !ownedCompanies.data.some((obj: any) => obj.company_id == companyId)
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const success = await this.companyService.deleteBanner(companyId);
        if (success) {
            return res.json(true);
        } else {
            return res
                .status(400)
                .json({ message: "Failed to delete avatar." });
        }
    };
    updateAvatar = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        const fileData = req.file;
        if (!fileData) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        if (!companyId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const ownedCompanies = await this.companyService.getOwnedCompanies(
            userId
        );
        if (
            ownedCompanies &&
            !ownedCompanies.data.some((obj: any) => obj.company_id == companyId)
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const success = await this.companyService.updateAvatar(
            companyId,
            fileData
        );
        if (success) {
            return res.json({
                newImg: fileData["filename"],
            });
        } else {
            return res
                .status(400)
                .json({ message: "Failed to update avatar." });
        }
    };
    updateBanner = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        const fileData = req.file;
        if (!fileData) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        if (!companyId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const ownedCompanies = await this.companyService.getOwnedCompanies(
            userId
        );
        if (
            ownedCompanies &&
            !ownedCompanies.data.some((obj: any) => obj.company_id == companyId)
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const success = await this.companyService.updateBanner(
            companyId,
            fileData
        );
        if (success) {
            return res.json({
                newImg: fileData["filename"],
            });
        } else {
            return res
                .status(400)
                .json({ message: "Failed to update banner." });
        }
    };
    createPost = async (req: Request, res: Response) => {
        const content = req.body.content;
        console.log("UserPostController=", content);

        const companyId = parseInt(req.params.id);

        console.log("postingUserId=", companyId);
        if (content) {
            const result = await this.companyService.createPost(
                companyId,
                content
            );
            res.json(result);
            return;
        }
        res.json({ message: "error" });
    };
    getCompanyPosts = async (req: Request, res: Response) => {
        const paramCompanyId: any = req.params.id;
        const companyId = parseInt(paramCompanyId);

        if (!paramCompanyId || !companyId) {
            res.status(400).json({ msg: "invalid input" });
        }

        const result = await this.companyService.getCompanyPosts(companyId);
        console.log(result);
    };
    getOwnedCompanyById = async (req: Request, res: Response) => {
        // console.log(req.params);
        const userId = parseInt(req.session["userId"]);
        let paramCompanyId = req.params["id"];
        const comapnyId = parseInt(paramCompanyId);
        const result = await this.companyService.getOwnedCompanyById(
            userId,
            comapnyId
        );
        res.json(result);
    };

    followCompany = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const result = await this.companyService.followCompany(
            userId,
            companyId
        );
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Failed" });
        }
    };

    addController = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        //@ts-ignore
        const targetUserId = parseInt(req.body.targetUserId);
        if (!companyId || !targetUserId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const result = await this.companyService.addController(
            userId,
            companyId,
            targetUserId
        );
        if (result.success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: result.message });
        }
    };
    editControllerLevel = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        //@ts-ignore
        const targetUserId = parseInt(req.body.targetUserId);
        //@ts-ignore
        const levelId = parseInt(req.body.levelId);
        if (!companyId || !targetUserId || !levelId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const result = await this.companyService.editControllerLevel(
            userId,
            companyId,
            targetUserId,
            levelId
        );
        if (result.success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: result.message });
        }
    };
    removeController = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        //@ts-ignore
        const targetUserId = parseInt(req.body.targetUserId);
        if (!companyId || !targetUserId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const result = await this.companyService.removeController(
            userId,
            companyId,
            targetUserId
        );
        if (result.success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: result.message });
        }
    };

    ///elsa
    allCompanyList = async (req: Request, res: Response) => {
        console.log(req.query);
        const result = await this.companyService.allCompanyList(
            req.query.name,
            req.query.category
        );
        res.json(result);
    };

    getCompanyInfoByCompanyId = async (req: Request, res: Response) => {
        const companiesId = parseInt(req.params.id);
        const result = await this.companyService.getCompanyInfoByCompanyId(
            companiesId
        );
        res.json(result);
    };
    getCompanyListByQuery = async (req: Request, res: Response) => {
        // const userId = parseInt(req["user"].id);
        const keywords = req.query.keywords;
        //@ts-ignore
        const offset = parseInt(req.query.offset);
        // console.log(req.query);
        //@ts-ignore
        const targetUserId = parseInt(req.body.targetUserId);
        if (!keywords || isNaN(offset)) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
        const result = await this.companyService.getCompanyListByQuery(
            keywords.toString(),
            offset
        );
        if (result) {
            return res.json({ data: result });
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getCompanyReviewsByCompanyId = async (req: Request, res: Response) => {
        const companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
        const result = await this.companyService.getCompanyReviewsByCompanyId(
            companyId
        );
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    postCompanyReview = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const data = req.body;
        const {
            job_title,
            commenter_type_id,
            employment_type_id,
            rating,
            review_title,
            pos_comment,
            neg_comment,
        } = req.body;
        //@ts-ignore
        const companyId = parseInt(req.params.id);
        if (
            !companyId ||
            !job_title ||
            !commenter_type_id ||
            !employment_type_id ||
            !rating ||
            !review_title ||
            !pos_comment ||
            !neg_comment
        ) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const success = await this.companyService.postCompanyReview(
            userId,
            companyId,
            data
        );
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };

    //elsa
    getPostByCo = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const result = await this.companyService.getPostByCo(id);
        console.log("result:", result);
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(400).json(result);
        }
    };
}
