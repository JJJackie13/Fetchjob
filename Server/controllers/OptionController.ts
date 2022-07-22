import { OptionService } from "../services/OptionService";
import { Response, Request } from "express";

export class OptionController {
    constructor(private optionService: OptionService) {}
    getAllLocations = async (req: Request, res: Response) => {
        try {
            const result = await this.optionService.getAllLocations();
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: "Failed" });
        }
    };
    getAllEducations = async (req: Request, res: Response) => {
        try {
            const result = await this.optionService.getAllEducations();
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: "Failed" });
        }
    };
    getAllIndustries = async (req: Request, res: Response) => {
        try {
            const result = await this.optionService.getAllIndustries();
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: "Failed" });
        }
    };
    getAllControlLevels = async (req: Request, res: Response) => {
        try {
            const result = await this.optionService.getAllControlLevels();
            if (result) {
                return res.json(result);
            } else {
                return res.status(400).json({ message: "Failed" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed" });
        }
    };
    getAllReportTypes = async (req: Request, res: Response) => {
        try {
            const result = await this.optionService.getAllReportTypes();
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: "Failed" });
        }
    };
    getAllPostReportTypes = async (req: Request, res: Response) => {
        try {
            const result = await this.optionService.getAllPostReportTypes();
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: "Failed" });
        }
    };
    getUserEditOptions = async (req: Request, res: Response) => {
        try {
            const industry = await this.optionService.getAllIndustries();
            const location = await this.optionService.getAllLocations();
            const education = await this.optionService.getAllEducations();
            if (industry && location && education) {
                return res.json({ ...industry, ...location, ...education });
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getCompanyEditOptions = async (req: Request, res: Response) => {
        try {
            const industry = await this.optionService.getAllIndustries();
            const location = await this.optionService.getAllLocations();
            const companyTypes = await this.optionService.getAllCompanyTypes();
            if (industry && location && companyTypes) {
                return res.json({ ...industry, ...location, ...companyTypes });
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getJobEditOptions = async (req: Request, res: Response) => {
        try {
            const location = await this.optionService.getAllLocations();
            const education = await this.optionService.getAllEducations();
            const employmentTypes =
                await this.optionService.getAllEmploymentTypes();
            if (location && education && employmentTypes) {
                return res.json({
                    ...location,
                    ...education,
                    ...employmentTypes,
                });
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getAllReviewOptions = async (req: Request, res: Response) => {
        try {
            const employmentTypes =
                await this.optionService.getAllEmploymentTypes();
            const commenterTypes =
                await this.optionService.getAllCommenterTypes();
            if (employmentTypes && commenterTypes) {
                return res.json({
                    ...employmentTypes,
                    ...commenterTypes,
                });
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
}
