import { Request, Response } from "express";
import { JobService } from "../services/JobService";

export class JobController {
    constructor(private jobService: JobService) {}
    get = async (req: Request, res: Response) => {
        const result = await this.jobService.getAllJobs();
        res.json(result);
    };
    post = async (req: Request, res: Response) => {
        const data = req.body;
        const result = await this.jobService.postJob(data);
        res.json(result);
    };
    put = async (req: Request, res: Response) => {
        const data = req.body;
        const id = parseInt(req.params.id);
        const result = await this.jobService.editJob(id, data);
        res.json(result);
    };
    delete = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const result = await this.jobService.deleteJob(id);
        res.json(result);
    };
    getSavedJobs = async (req: Request, res: Response) => {
        const id = parseInt(req["user"].id);
        const result = await this.jobService.getSavedJobs(id);
        res.json(result);
    };
    getAllJobsByCompany = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Invalid company id" });
        }
        const result = await this.jobService.getAllJobsByCompany(
            userId,
            companyId
        );
        if (result) {
            return res.json({ data: result });
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getRandomJob = async (req: Request, res: Response) => {
        const jobId = parseInt(req.params.id);
        const userId = parseInt(req["user"].id);
        const result = await this.jobService.getRandomJob(userId, jobId);
        res.json(result);
    };
    getJobById = async (req: Request, res: Response) => {
        const jobId = parseInt(req.params.id);
        if (!jobId) {
            return res.status(400).json({ message: "Invalid id" });
        }
        const result = await this.jobService.getJobById(jobId);
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getRecommendedJobs = async (req: Request, res: Response) => {
        const id = parseInt(req["user"].id);
        const result = await this.jobService.getRecommendedJobs(id);
        res.json(result);
    };
    getAllRecommendedJobs = async (req: Request, res: Response) => {
        const id = parseInt(req["user"].id);
        const result = await this.jobService.getAllRecommendedJobs(id);
        res.json(result);
    };
    getRecommendedJobsbyExp = async (req: Request, res: Response) => {
        const id = parseInt(req["user"].id);
        const result = await this.jobService.getRecommendedJobsbyExp(id);
        res.json(result);
    };
    getAllRecommendedJobsbyExp = async (req: Request, res: Response) => {
        const id = parseInt(req["user"].id);
        const result = await this.jobService.getAllRecommendedJobsbyExp(id);
        res.json(result);
    };
    bookmarkJob = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "Invalid post id" });
        }
        const jobId = parseInt(req.params.id);
        const userId = parseInt(req["user"].id);
        const result = await this.jobService.bookmarkJob(userId, jobId);
        if (result) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }
    };
    removeSavedJob = async (req: Request, res: Response) => {
        const jobId = parseInt(req.params.id);
        const userId = parseInt(req["user"].id);
        const result = await this.jobService.removeSavedJob(userId, jobId);
        res.json(result);
    };
    getAllEducationRequirements = async (req: Request, res: Response) => {
        const result = await this.jobService.getAllEducationRequirements();
        res.json(result);
    };
    postNewJob = async (req: Request, res: Response) => {
        const data = req.body;
        console.log(data);
        const companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Invalid id" });
        }
        const result = await this.jobService.postNewJob(companyId, data);
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Request failed" });
        }
    };
    EditJob = async (req: Request, res: Response) => {
        const data = req.body;
        const jobId = parseInt(req.params.id);
        if (!jobId) {
            return res.status(400).json({ message: "Invalid id" });
        }
        const result = await this.jobService.postNewJob(jobId, data);
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Request failed" });
        }
    };
    applyJob = async (req: Request, res: Response) => {
        const data = req.body;
        const jobId = parseInt(req.params.id);
        const userId = parseInt(req["user"].id);
        const result = await this.jobService.applyJob(userId, jobId, data);
        res.json(result);
    };
    getPostJob = async (req: Request, res: Response) => {
        const companyId = parseInt(req.params.id);
        const result = await this.jobService.getPostJob(companyId);
        res.json(result);
    };
    closePostJob = async (req: Request, res: Response) => {
        const jobId = parseInt(req.params.id);
        const result = await this.jobService.closePostJob(jobId);
        res.json(result);
    };
    getHistoryJob = async (req: Request, res: Response) => {
        const companyId = parseInt(req.params.id);
        const result = await this.jobService.getHistoryJob(companyId);
        res.json(result);
    };
    openPostJob = async (req: Request, res: Response) => {
        const jobId = parseInt(req.params.id);
        const result = await this.jobService.openPostJob(jobId);
        res.json(result);
    };
    getUsersApplyJob = async (req: Request, res: Response) => {
        const jobId = parseInt(req.params.id);
        const result = await this.jobService.getUsersApplyJob(jobId);
        res.json(result);
    };
    getJobAppliedByUser = async (req: Request, res: Response) => {
        const id = parseInt(req["user"].id);
        console.log("UserID check", id)
        const result = await this.jobService.getJobAppliedByUser(id);
        res.json(result);
    };
}
