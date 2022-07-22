import { Request, Response } from "express";
import { PersonalService } from "../services/PersonalService";

export class PersonalController {
    constructor(private personalService: PersonalService) {}

    getPersonalById = async (req: Request, res: Response) => {
        console.log(req.params);

        let paramPersonalId = req.params["id"];
        const personalId = parseInt(paramPersonalId);
        const result = await this.personalService.getPersonalById(personalId);
        res.json(result);
    };

    editPersonal = async (req: Request, res: Response) => {
        const userId = parseInt(req.session["userId"]);
        const body = req.body;
        console.log("req.body = ", req.body);
        const result = await this.personalService.editPersonal(userId, body);
        res.json(result);
    };
}
