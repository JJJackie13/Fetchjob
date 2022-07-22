import express from "express";
import { searchController } from "../server";
import { multerEmpty } from "../multer"

export const searchRoutes = express.Router();

searchRoutes.get('/search',  searchController.getAllResult);
searchRoutes.get('/search-select-company', searchController.getCompResult);
searchRoutes.get('/search-select-job', searchController.getJobResult);
searchRoutes.get('/search-select-member', searchController.getUserResult);
searchRoutes.get('/filter', searchController.getIndustryList);
searchRoutes.get('/newCheckBox/:id', searchController.getNewIndustryList);
searchRoutes.get('/filterlocation', searchController.getLocationList);
searchRoutes.get('/newLocationCheckBox/:id', searchController.getNewLocationList);
searchRoutes.get('/filtercompany', searchController.getCompanyList);
searchRoutes.get('/newCompanyCheckBox/:id', searchController.getNewCompanyList);
searchRoutes.post('/filterSet', multerEmpty, searchController.getFilterRes)