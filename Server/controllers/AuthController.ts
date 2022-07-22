import { Request, Response } from "express";
import fetch from "node-fetch";
import jwtSimple from "jwt-simple";

import jwt from "../jwt";
import { AuthService } from "../services/AuthService";
import { io } from "../server";
import { hashPassword, checkPassword } from "../hash";
import { logger } from "../logger";

export class AuthController {
    constructor(private authService: AuthService) {}
    register = async (req: Request, res: Response) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            if (!email || !password || !first_name || !last_name) {
                return res.status(400).json({
                    message: "All inputs are required",
                });
            }

            const matchedUsers = await this.authService.getUserInfo(email);
            if (matchedUsers.length >= 1) {
                return res.status(400).json({
                    message: "Email is already existed",
                });
            }
            const hashedPassord = await hashPassword(password);
            const result = await this.authService.register(
                email,
                hashedPassord,
                first_name,
                last_name
            );
            if (result.success) {
                return res.json(true);
            } else {
                return res.status(400).json({ message: "Failed to register" });
            }
        } catch (error) {
            logger.error("REGISTER ERROR");
            console.log(error);
            return res.status(500).json({ message: error.toString() });
        }
    };
    logout = async (req: Request, res: Response) => {
        try {
            io.emit("status-offline", req.session["userId"]);
            req.session.destroy(() => {});
            res.json(true);
        } catch (error) {
            logger.error("LOGOUT ERROR");
            console.log(error);
            res.status(400).json({ message: error.toString() });
        }
    };
    login = async (req: Request, res: Response) => {
        try {
            if (!req.body.email || !req.body.password) {
                return res.status(401).json({
                    message: "All inputs are required",
                });
            }
            const { email, password } = req.body;
            const user = (
                await this.authService.getUserInfo(email.toLowerCase())
            )[0];
            if (!user || !(await checkPassword(password, user.password))) {
                return res.status(401).json({
                    message: "Email or password is incorrect",
                });
            }
            if (!user.is_activated) {
                return res.status(401).json({
                    message: "Account is deactivated",
                });
            }
            // req.session["userId"] = user.email.toLowerCase();
            const payload = {
                id: user.id,
                user_id: user.id,
                email: user.email,
                name: user.first_name + " " + user.last_name,
                avatar: user.avatar,
                banner: user.banner,
                // role: user.role_id,
                is_admin: user.is_admin,
                updated_at: user.updated_at,
            };
            const token = jwtSimple.encode(payload, jwt.jwtSecret);

            return res.json({
                token: token,
            });
        } catch (error) {
            logger.error("LOGIN ERROR");
            console.log(error);
            return res.status(500).json({ message: error.toString() });
        }
    };
    loginGoogle = async (req: Request, res: Response) => {
        try {
            const accessToken = req.session?.["grant"].response.access_token;
            const fetchRes = await fetch(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                {
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const googleUserInfo = await fetchRes.json();
            const result = await this.authService.loginGoogle(googleUserInfo);
            if (req.session && result.success) {
                req.session["userId"] = result.data.id;
                req.session["userEmail"] = result.data.email;
            }
            console.log("GOOGLE", googleUserInfo);
            res.redirect("/");
        } catch (error) {
            console.log(error);
            // res.json({ success: false, message: error });
            res.redirect("/signin.html");
        }
    };
    editBasicInfo = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const data = req.body;
        if (data.hobbies && data.hobbies.length > 10) {
            return res
                .status(404)
                .json({ message: "Maximum 10 hobbies are allowed" });
        }
        if (data.skills && data.skills.length > 10) {
            return res
                .status(404)
                .json({ message: "Maximum 10 skills are allowed" });
        }
        const success = await this.authService.editBasicInfo(userId, data);
        if (success) {
            const token = await this.authService.getToken(userId);
            if (!token) {
                return res.status(400).json({
                    message: "Unknown error",
                });
            }
            return res.json({
                token: token,
                message: "Successfully updated",
            });
        } else {
            return res
                .status(404)
                .json({ message: "Failed to update profile" });
        }
    };
    deleteAvatar = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const success = await this.authService.deleteAvatar(userId);
        if (success) {
            const token = await this.authService.getToken(userId);
            if (!token) {
                return res.status(400).json({
                    message: "Unknown error",
                });
            }
            return res.json({
                token: token,
            });
        } else {
            return res
                .status(400)
                .json({ message: "Failed to delete avatar." });
        }
    };
    deleteBanner = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const success = await this.authService.deleteBanner(userId);
        if (success) {
            const token = await this.authService.getToken(userId);
            if (!token) {
                return res.status(400).json({
                    message: "Unknown error",
                });
            }
            return res.json({
                token: token,
            });
        } else {
            return res.status(400).json({ message: "Failed to delete banner" });
        }
    };
    updateAvatar = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const fileData = req.file;
        if (!fileData) {
            return res.status(401).json({ message: "No image uploaded" });
        }
        const success = await this.authService.updateAvatar(userId, fileData);

        if (success) {
            const token = await this.authService.getToken(userId);
            if (!token) {
                return res.status(400).json({
                    message: "Unknown error.",
                });
            }
            return res.json({
                token: token,
            });
        } else {
            return res.status(400).json({ message: "Failed to update avatar" });
        }
    };
    updateBanner = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const fileData = req.file;
        if (!fileData) {
            return res.json({ success: false, message: "No image uploaded" });
        }
        const success = await this.authService.updateBanner(userId, fileData);

        if (success) {
            const token = await this.authService.getToken(userId);
            if (!token) {
                return res.status(400).json({
                    message: "Unknown error",
                });
            }
            return res.json({
                token: token,
            });
        } else {
            return res.status(400).json({ message: "Failed to update banner" });
        }
    };
    updateResume = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const fileData = req.file;
        if (!fileData) {
            return res.status(401).json({ message: "No file uploaded" });
        }
        const success = await this.authService.updateResume(userId, fileData);

        if (success) {
            const token = await this.authService.getToken(userId);
            if (!token) {
                return res.status(400).json({
                    message: "Unknown error.",
                });
            }
            return res.json({
                token: token,
            });
        } else {
            return res.status(400).json({ message: "Failed to update file" });
        }
    };
}
