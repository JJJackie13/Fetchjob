import { Request, Response, NextFunction } from "express";
import { Bearer } from "permit";
import jwtSimple from "jwt-simple";
import { authService } from "../server";

import { logger } from "../logger";
import jwt from "../jwt";

const permit = new Bearer({
    query: "access_token",
});

export const isAuthFrontend = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.session && req.session["userId"]) {
        const userInfo = {
            id: req.session["userId"],
            email: req.session["userEmail"],
            img: req.session["userImg"],
        };
        res.json({ success: true, data: userInfo });
    } else {
        logger.info("User login first!");

        res.json({ success: false, message: "Please login first." });
    }
};

export const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = permit.check(req);
        if (!token) {
            return res.status(401).json({ message: "Missing Credentials" });
        }
        const payload = jwtSimple.decode(token, jwt.jwtSecret);
        const user = await authService.getUserInfo(payload.email);
        if (!user[0].is_activated) {
            return res.status(401).json({
                message: "Account is deactivated",
            });
        }
        if (user && user.length === 1) {
            req["user"] = user[0];
            return next();
        } else {
            return res.status(403).json({ message: "Missing Credentials" });
        }
        // if (
        //     req.session &&
        //     req.session["userId"] &&
        //     req.session["userId"] === payload.id
        // ) {
        //     return next();
        // } else {
        //     return res.status(403).json({ message: "Missing Credentials" });
        // }
    } catch (error) {
        return res.status(403).json({ message: "Missing Credentials" });
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = permit.check(req);
        if (!token) {
            return res.status(401).json({ message: "Missing Credentials" });
        }
        const payload = jwtSimple.decode(token, jwt.jwtSecret);
        const users = await authService.getUserInfo(payload.email);
        let user = users[0]
        if (user && user.is_admin) {
            req["user"] = user
            return next();
        } else {
            return res.status(403).json({ message: "Missing Credentials" });
        }
    } catch (error) {
        return res.status(403).json({ message: "Missing Credentials" });
    }
};
