import { Request, Response, NextFunction } from "express";
// import { format } from "fecha";
import { logger } from "./logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    // [2018-11-12 09:21:31] Request /index.js
    // let dateTimeString = format(new Date(), "YYYY-MM-DD HH:mm:ss");
    logger.info(`${req.method} ${req.path}`);
    logger.debug(`Params :${JSON.stringify(req.params)} | Query: ${JSON.stringify(req.query)} | Body :${JSON.stringify(req.body)}`);
    next();
}

export function dummyCounter(req: Request, res: Response, next: NextFunction) {
    let counter = req.session["counter"] || 0;
    counter++;
    req.session["counter"] = counter;
    next();
}

export function pageNotFound(req: Request, res: Response) {
    logger.warn("錯link :", req.path);
    res.redirect("/404.html");
}
