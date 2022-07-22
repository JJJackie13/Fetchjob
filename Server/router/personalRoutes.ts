import express from "express";
import { multerProfileSingle } from "../multer";
import { multerCoverSingle } from "../multer";
import { multerEmpty } from "../multer";
import { personalController } from "../server";
import { isAuth } from "../middlewares/auth";

export const personalRoutes = express.Router();

personalRoutes.get("/personal/:id", isAuth, personalController.getPersonalById);
personalRoutes.put("/personal", multerEmpty, personalController.editPersonal);
personalRoutes.delete(
    "/delete_profile_image",
    isAuth,
    personalController.deleteProfileImg
);
personalRoutes.delete("/delete_cover_image", personalController.deleteCoverImg);
personalRoutes.put(
    "/update_profile_image",
    isAuth,
    multerProfileSingle,
    personalController.updateProfileImage
);
personalRoutes.put(
    "/update_cover_image",
    isAuth,
    multerCoverSingle,
    personalController.updateCoverImage
);
