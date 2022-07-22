import { Request, Response } from "express";
import { SearchService } from "../services/SearchService";

export class SearchController{
    constructor(private searchService: SearchService) {}
    
    getAllResult = async (req: Request, res: Response) => {
        let allResult: any[] = []
        console.log("ok")
        const key1: any = req.query.keywords;
        const key2: any = req.query.keywords;
        const key3: any = req.query.keywords;
        const result1 = await this.searchService.getCompSearchRes(key1);
        const result2 = await this.searchService.getUserSearchRes(key2);
        const result3 = await this.searchService.getJobSearchRes(key3);
        allResult.push(result1);
        allResult.push(result2);
        allResult.push(result3);
        // console.log(result1)
        console.log("Keys: ", key1, key2, key3)
        console.log("All_Results:", allResult)
        res.json(allResult)
    }
    getCompResult = async (req: Request, res: Response) => {
        const key: any = req.query.keywords;
        const result = await this.searchService.getCompSearchRes(key);
        console.log("Result:", result)
        res.json(result)
    }
    getJobResult = async (req: Request, res: Response) => {
        const key: any = req.query.keywords;
        const result = await this.searchService.getJobSearchRes(key);
        console.log("Result:", result)
        res.json(result)
    }
    getUserResult = async (req: Request, res: Response) => {
        let resultArr = [];
        const key: any = req.query.keywords;
        const result = await this.searchService.getUserSearchRes(key);
        const industryCheckBoxRes = await this.searchService.getIndustryCB(key);
        const locationCheckBoxRes = await this.searchService.getLocationCB(key);
        const companyCheckBoxRes = await this.searchService.getCompanyCB(key);
        resultArr.push(result)
        resultArr.push(industryCheckBoxRes)
        resultArr.push(locationCheckBoxRes)
        resultArr.push(companyCheckBoxRes)
        // console.log("Result:", resultArr);
        res.json(resultArr)
    }getCompResultLimit = async (req: Request, res: Response) => {
        const key: any = req.query.keywords;
        const result = await this.searchService.getCompSearchResLimit(key);
        console.log("CompanyLimitResult:", result)
        res.json(result)
    }
    getJobResultLimit = async (req: Request, res: Response) => {
        const key: any = req.query.keywords;
        const result = await this.searchService.getJobSearchResLimit(key);
        console.log("JobLimitResult:", result)
        res.json(result)
    }
    getUserResultLimit = async (req: Request, res: Response) => {
        // let resultArr = [];
        const key: any = req.query.keywords;
        console.log("Keywords", req.query.keywords)
        const result = await this.searchService.getUserSearchResLimit(key);
        console.log("UserLimitResult:", result.data);
        res.json(result)
    }
    getIndustryList = async (req: Request, res: Response) => {
        const  { keywords, industries } = req.query
        const result = await this.searchService.getIndustryListRes(keywords, industries)
        console.log("result ====>", result)
        res.json(result)
    }
    getNewIndustryList = async (req: Request, res: Response) => {
        const  { id } = req.params
        const result = await this.searchService.getNewIndustryListRes(id)
        console.log("id result ====>", result)
        res.json(result)
    }
    getLocationList = async (req: Request, res: Response) => {
        const  { keywords, location } = req.query
        const result = await this.searchService.getLocationListRes(keywords, location)
        console.log("location list result ====>", result)
        res.json(result)
    }
    getNewLocationList = async (req: Request, res: Response) => {
        const  { id } = req.params
        const result = await this.searchService.getNewLocationListRes(id)
        console.log("location id result ====>", result)
        res.json(result)
    }
    getCompanyList = async (req: Request, res: Response) => {
        const  { keywords, companies } = req.query
        const result = await this.searchService.getCompanyListRes(keywords, companies)
        console.log("companies list result ====>", result)
        res.json(result)
    }
    getNewCompanyList = async (req: Request, res: Response) => {
        const  { id } = req.params
        const result = await this.searchService.getNewCompanyListRes(id)
        console.log("companies id result ====>", result)
        res.json(result)
    }
    getFilterRes = async (req: Request, res: Response) => {
        const { keywords } = req.query
        const { industry, location, company } = req.body
        console.log({ industry, location, company })
        console.log("Filter keyword result ====>", keywords)
        const result = await this.searchService.getUserFilterSearchRes(keywords, industry, location, company )
        console.log("Result ===> ",result, "<=== Result")
        res.json(result)
    }
}