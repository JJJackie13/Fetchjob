import express from "express";
import { jobController } from "../server";
import { isAuth } from "../middlewares/auth";
import { multerEmpty } from "../multer";

export const jobRoutes = express.Router();

jobRoutes.get("/job/saved", isAuth, jobController.getSavedJobs);
jobRoutes.get("/job/recommended", isAuth, jobController.getRecommendedJobs);
jobRoutes.post("/job/saved/:id", isAuth, jobController.addSavedJob);
jobRoutes.delete("/job/saved/:id", isAuth, jobController.removeSavedJob);
jobRoutes.get("/job/education", jobController.getAllEducationRequirements);
jobRoutes.post("/job/new-job/:id", isAuth, multerEmpty, jobController.postNewJob);
jobRoutes.get("/job/search_e", jobController.get);
// jobRoutes.post("/job/details/:id", isAuth, jobController.getJobDetails);
// jobRoutes.get("/search_e/:id", jobController.get);
// jobRoutes.post("/", jobController.post);
// jobRoutes.put("/", jobController.put);
// jobRoutes.delete("/", jobController.delete);
