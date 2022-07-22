import express from "express";
import { networkController } from "../server";
import { isAuth } from "../middlewares/auth";

export const networkRoutes = express.Router();

networkRoutes.get("", isAuth, networkController.getAllNetworksForChat);
networkRoutes.get("/industry", isAuth, networkController.getSimilarIndustry);
networkRoutes.get("/request", isAuth, networkController.getAllRequest);
networkRoutes.post("/request", isAuth, networkController.makeRequest);
networkRoutes.post("/respond", isAuth, networkController.respondToRequest);
