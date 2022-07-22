import { Request, Response } from "express";
//import { userRoutes } from "../router/userRoutes";
import { AdminService } from "../services/AdminService";
import { AuthService } from "../services/AuthService";
import { knex } from "../server";
import { checkPassword } from "../hash";
import jwt from "../jwt";
import jwtSimple from "jwt-simple";

export class AdminController {
    constructor(private AdminService: AdminService) { }
    loginAdmin = async (req: Request, res: Response) => {

        try {
            const authService = new AuthService(knex)
            console.log(req.body);
            if (!req.body.email || !req.body.password) {
                return res.status(401).json({
                    message: "All inputs are required.",
                });

            }
            const { email, password } = req.body;
            const user = (
                await authService.getUserInfo(email.toLowerCase())
            )[0];
            if (!user || !(await checkPassword(password, user.password))) {
                return res.status(401).json({
                    message: "Email or password is incorrect.",
                });

            }
            if (!user.is_admin) {
                return res.status(403).json({
                    message: "Not authorised",
                });
            }
            const payload = {
                id: user.id,
                user_id: user.id,
                email: user.email,
                name: user.first_name + " " + user.last_name,
                avatar: user.avatar,
                banner: user.banner,
                role: user.role_id,
                is_admin: user.is_admin,
                is_activated: user.is_activated
            };
            const token = jwtSimple.encode(payload, jwt.jwtSecret);
            return res.json({
                token: token,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.toString() });
        }
    };
    temp = () => {
        console.log(this.AdminService)
    };



    //--Admin Info
    getAdminInfo = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.AdminService.getAdminInfo(
                id
            ); res.json(result)
            console.log("result: ", result);
        } catch (error) {
            res.status(500).json({ error: (error as Error).toString() })
        }
    };

    updateAdmin = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id)
        const id = parseInt(req.params.id);
        const body = req.body;
        console.log("req.body", req.body);
        if (!body) {
            res.json({ success: false, message: "No uploaded" });
        }
        const result = await this.AdminService.updateAdmin(
            userId,
            id,
            req.body
        );
        res.json(result);
    };






    //--User update
    updateUserState = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id)
        const id = parseInt(req.params.id);
        const body = req.body;
        console.log("req.body", req.body);
        if (!body) {
            res.json({ success: false, message: "No uploaded" });
        }
        const result = await this.AdminService.updateUserState(
            userId,
            id,
            req.body
        );
        res.json(result);
    };

    //--Post update
    updatePostState = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id)
        const postsId = parseInt(req.params.id);
        const {
            is_activated,
        } = req.body;
        console.log("req.body", postsId);
        // if (!body) {
        //     res.json({ success: false, message: "No uploaded" });
        // }
        const result = await this.AdminService.updatePostState(
            userId,
            postsId,
            is_activated
        );
        res.json(result);
    };

    //--Company update
    updateCompanyState = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const id = parseInt(req.params.id);
        const body = req.body;
        console.log("req.body", req.body);
        if (!body) {
            res.json({ success: false, message: "No uploaded" });
        }
        const result = await this.AdminService.updateCompanyState(
            userId,
            id,
            req.body
        );
        res.json(result);
    };

    //--Report List

    getReportList = async (req: Request, res: Response) => {
        try {
            console.log(req.query);
            const filter = req.query.filter
            const name = req.query.name || ''
            let report_list = await this.AdminService.getReportList(
                filter,
                name
            )
            // res.json({ length: report_list.length })
            res.json({ report_list })
        } catch (error) {
            res.status(500).json({ error: (error as Error).toString() })
        }
    }


    getReportInfo = async (req: Request, res: Response) => {
        try {
            const report_table = req.params.report_table;
            const report_id = parseInt(req.params.report_id);
            const result = await this.AdminService.getReportInfo(
                report_table,
                report_id
            )
            res.json(result)
        } catch (error) {
            res.status(500).json({ error: (error as Error).toString() })
        }
    };

    resolveReport = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const report_table = req.params.report_table;
            const report_id = parseInt(req.params.report_id);
            const body = req.body;
            console.log("req.body", req.body);
            if (!body) {
                res.json({ success: false, message: "No uploaded" });
            }
            const result = await this.AdminService.resolveReport(
                userId,
                report_table,
                report_id,
                req.body
            )
            res.json(result)
        } catch (error) {
            res.status(500).json({ error: (error as Error).toString() })
        }
    };




}

