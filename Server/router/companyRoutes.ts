import express from "express";
import { multerCompanyLogo, multerEmpty } from "../multer";
import { companyController } from "../server";
import { isAdmin, isAuth } from "../middlewares/auth";


export const companyRoutes = express.Router();

// userRoutes.get("/current_user", isAuth, userController.getCurrentUser);
companyRoutes.get("/company/:id", isAuth, companyController.getCompanyById);
companyRoutes.put(
    "/company-edit/:id",
    isAuth,
    multerEmpty,
    companyController.editCompany
);
companyRoutes.delete(
    "/delete-logo/:id",
    isAuth,
    companyController.deleteLogoImg
);
companyRoutes.put(
    "/update-logo/:id",
    isAuth,
    multerCompanyLogo,
    companyController.updateLogoImage
);

companyRoutes.put(
    "/company/update-company-info/:id",
    isAdmin,
    companyController.updateCompanyInfo
);

companyRoutes.get("/owned-company", companyController.getOwnedCompanies);
companyRoutes.get("/industry", companyController.getAllIndustries);
companyRoutes.get("/company-type", companyController.getAllTypes);

////////
// companyRoutes.get("/users", companyController.getMasterByUserAndCompanyId);
companyRoutes.get("/all-company-names", companyController.getAllCompanyNames);
companyRoutes.post("/postForFompany/:id", companyController.createPost);
companyRoutes.get("/getCompanyPosts/:id", companyController.getCompanyPosts);
companyRoutes.get(
    "/owned-company/:id",

    companyController.getOwnedCompanyById
);
////
companyRoutes.get("/company/getCompanyInfoByCompanyId/:id",
    companyController.getCompanyInfoByCompanyId
);