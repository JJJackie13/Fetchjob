import express from "express";
import { isAuth } from "./middlewares/auth";
import {
    multerEmpty,
    multerAvatarSingle,
    multerBannerSingle,
    multerThreadMulti,
    multerResumeSingle,
} from "./multer";

import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { CompanyController } from "./controllers/CompanyController";
import { PersonalController } from "./controllers/PersonalController";
import { JobController } from "./controllers/JobController";
import { SearchController } from "./controllers/SearchController";
import { NetworkController } from "./controllers/NetworkController";
import { ChatController } from "./controllers/ChatController";
import { ThreadController } from "./controllers/ThreadController";
import { OptionController } from "./controllers/OptionController";
import { AdminController } from "./controllers/AdminController";
import { ReportController } from "./controllers/ReportController";
import { NotificationController } from "./controllers/NotificationController";
import { ChatBotController } from "./controllers/ChatbotController";

// use the isLoggedIn guard to make sure only admin can call this API
export function createRouter(options: {
    authController: AuthController;
    userController: UserController;
    companyController: CompanyController;
    personalController: PersonalController;
    jobController: JobController;
    searchController: SearchController;
    networkController: NetworkController;
    chatController: ChatController;
    threadController: ThreadController;
    optionContoller: OptionController;
    adminController: AdminController;
    reportController: ReportController;
    notificationController: NotificationController;
    chatbotController: ChatBotController;
}) {
    const {
        authController,
        userController,
        companyController,
        personalController,
        jobController,
        searchController,
        networkController,
        chatController,
        threadController,
        optionContoller,
        adminController,
        reportController,
        notificationController,
        chatbotController,
    } = options;

    let router = express.Router();

    // AUTH ROUTES
    router.get("/auth/logout", authController.logout);
    router.get("/auth/login/google", authController.loginGoogle);
    router.post("/auth/login", authController.login);
    router.post("/auth/register", authController.register);
    router.post("/auth/basicinfo", isAuth, authController.editBasicInfo);
    router.delete("/auth/avatar", isAuth, authController.deleteAvatar);
    router.delete("/auth/banner", isAuth, authController.deleteBanner);
    router.post(
        "/auth/avatar",
        isAuth,
        multerAvatarSingle,
        authController.updateAvatar
    );
    router.post(
        "/auth/banner",
        isAuth,
        multerBannerSingle,
        authController.updateBanner
    );
    router.post(
        "/resume/upload",
        isAuth,
        multerResumeSingle,
        authController.updateResume
    );

    // USER ROUTES
    router.get("/user/profile/:id", isAuth, userController.getUserProfileById);
    router.get(
        "/user/relation/:id",
        userController.getFriendRelationStatusById
    );
    router.get("/user/current_user", isAuth, userController.getCurrentUser);
    router.put("/user/addFriend/:id", userController.addFriend);
    router.post("/user/memo", userController.createPost);
    router.get("/user/getPosts/:id", userController.getUserPosts);
    router.get("/user/all", userController.getAllUsersByKeywords);
    router.get("/user/education-options", userController.getEducationOptions);
    router.put("/user/addLike/:id", isAuth, userController.likePost);
    router.get("/user/allPostsList", userController.allPostsList);
    router.get("/user/applyJobInfo", isAuth, userController.getUserInfo);

    // COMPANY ROUTES
    router.get("/company/getCompanyList", companyController.allCompanyList);
    router.get(
        "/company/companyInfo/:id",
        companyController.getCompanyInfoByCompanyId
    );
    router.get(
        "/company/company/:id",
        isAuth,
        companyController.getCompanyById
    );
    router.get("/company/info/:id", isAuth, companyController.getCompanyById);
    router.delete(
        "/company/avatar/:id",
        isAuth,
        companyController.deleteAvatar
    );
    router.delete(
        "/company/banner/:id",
        isAuth,
        companyController.deleteBanner
    );
    router.post(
        "/company/avatar/:id",
        isAuth,
        multerAvatarSingle,
        companyController.updateAvatar
    );
    router.post(
        "/company/banner/:id",
        isAuth,
        multerBannerSingle,
        companyController.updateBanner
    );
    router.post(
        "/company/basicinfo/:id",
        isAuth,
        companyController.editBasicInfo
    );

    router.get(
        "/company/owned-company",
        isAuth,
        companyController.getOwnedCompanies
    );
    router.get("/company/company-type", companyController.getAllTypes);
    router.get(
        "/company/company-names",
        isAuth,
        companyController.getAllCompanyInfo
    );
    router.post("/company/postForFompany/:id", companyController.createPost);
    router.get(
        "/company/getCompanyPosts/:id",
        companyController.getCompanyPosts
    );
    router.get(
        "/company/owned-company/:id",
        companyController.getOwnedCompanyById
    );
    router.put("/company/follow/:id", isAuth, companyController.followCompany);
    // --company controller
    router.post(
        "/company/controller/:id",
        isAuth,
        companyController.addController
    );
    router.put(
        "/company/controller/:id",
        isAuth,
        companyController.editControllerLevel
    );
    router.delete(
        "/company/controller/:id",
        isAuth,
        companyController.removeController
    );
    // --company review
    router.get(
        "/company/review-list",
        isAuth,
        companyController.getCompanyListByQuery
    );
    router.get(
        "/company/review/:id",
        isAuth,
        companyController.getCompanyReviewsByCompanyId
    );
    router.post(
        "/company/review/:id",
        isAuth,
        companyController.postCompanyReview
    );

    // PERSONAL
    router.get(
        "/personal/personal/:id",
        isAuth,
        personalController.getPersonalById
    );
    router.put(
        "/personal/personal",
        multerEmpty,
        personalController.editPersonal
    );

    // JOB ROUTES
    router.get("/job/saved", isAuth, jobController.getSavedJobs);
    router.get(
        "/job/company/:id/all",
        isAuth,
        jobController.getAllJobsByCompany
    );
    router.get(
        "/job/recommended/industry",
        isAuth,
        jobController.getRecommendedJobs
    );
    router.get(
        "/job/recommended/exp",
        isAuth,
        jobController.getRecommendedJobsbyExp
    );
    router.get(
        "/job/recommended/all/industry",
        isAuth,
        jobController.getAllRecommendedJobs
    );
    router.get(
        "/job/recommended/all/exp",
        isAuth,
        jobController.getAllRecommendedJobsbyExp
    );
    router.get(
        "/job/recommended/random/industry/:id",
        isAuth,
        jobController.getRandomJob
    );
    router.put("/job/saved/:id", isAuth, jobController.bookmarkJob);
    router.delete("/job/saved/:id", isAuth, jobController.removeSavedJob);
    router.get("/job/education", jobController.getAllEducationRequirements);
    router.post(
        "/job/new-job/:id",
        isAuth,
        multerEmpty,
        jobController.postNewJob
    );
    // router.post("/job/details/:id", isAuth, jobController.getJobDetails);
    router.get("/job/:id", isAuth, jobController.getJobById);
    router.get("/job/recommended", isAuth, jobController.getRecommendedJobs);
    // router.post("/job/saved/:id", isAuth, jobController.addSavedJob);
    router.post("/job/:id", isAuth, jobController.postNewJob);
    router.put("/job/:id", isAuth, jobController.EditJob);
    router.post("/apply/job/:id", isAuth, jobController.applyJob);
    router.get("/job/post-job/:id", isAuth, jobController.getPostJob);
    router.put("/job/close-job/:id", isAuth, jobController.closePostJob);
    router.get("/job/history-job/:id", isAuth, jobController.getHistoryJob);
    router.put("/job/open-job/:id", isAuth, jobController.openPostJob);
    router.get("/job/applied-users/:id", isAuth, jobController.getUsersApplyJob)
    router.get("/job/applied-by-user", isAuth, jobController.getJobAppliedByUser)
    // SEARCH ROUTES
    router.get("/search", searchController.getAllResult);
    router.get("/search-select-company", searchController.getCompResult);
    router.get("/search-select-job", searchController.getJobResult);
    router.get("/search-select-user", searchController.getUserResult);
    router.get(
        "/search-result-company",
        isAuth,
        searchController.getCompResultLimit
    );
    router.get(
        "/search-result-job",
        isAuth,
        searchController.getJobResultLimit
    );
    router.get(
        "/search-result-user",
        isAuth,
        searchController.getUserResultLimit
    );
    router.get("/filter", searchController.getIndustryList);
    router.get("/newCheckBox/:id", searchController.getNewIndustryList);
    router.get("/filterlocation", searchController.getLocationList);
    router.get("/newLocationCheckBox/:id", searchController.getNewLocationList);
    router.get("/filtercompany", searchController.getCompanyList);
    router.get("/newCompanyCheckBox/:id", searchController.getNewCompanyList);
    router.post("/filterSet", multerEmpty, searchController.getFilterRes);

    // NETWORKS ROUTES
    router.get("/network/all", isAuth, networkController.getAllConnections);
    // router.get("/network/", isAuth, networkController.getAllNetworksForChat);
    router.get(
        "/network/recommend/industry",
        isAuth,
        networkController.getSimilarIndustry
    );
    router.get(
        "/network/recommend/company",
        isAuth,
        networkController.getSimilarCompany
    );
    router.get(
        "/network/recommend/hobby",
        isAuth,
        networkController.getSimilarHobby
    );
    router.get(
        "/network/recommend/skill",
        isAuth,
        networkController.getSimilarSkill
    );
    router.get("/network/request", isAuth, networkController.getAllRequests);
    router.delete(
        "/network/remove/:id",
        isAuth,
        networkController.removeConnection
    );
    router.post("/network/request/:id", isAuth, networkController.makeRequest);
    router.put(
        "/network/request/respond",
        isAuth,
        networkController.respondToRequest
    );

    // CHAT ROUTES
    router.get("/chat/history/all", isAuth, chatController.getAllChatHistory);
    router.get(
        "/chat/users",
        isAuth,
        chatController.getAllUsersForChatByKeyword
    );
    router.get(
        "/chat/history/room/:id",
        isAuth,
        chatController.getChatHistoryByRoomId
    );
    router.get(
        "/chat/history/last",
        isAuth,
        chatController.getAllLastChatHistory
    );
    router.post("/chat/message", isAuth, chatController.sendMessage);

    // THREAD ROUTES
    router.post(
        "/thread/user",
        isAuth,
        multerThreadMulti,
        threadController.postUserThread
    );
    router.post(
        "/thread/company/:id",
        isAuth,
        multerThreadMulti,
        threadController.postCompanyThread
    );
    router.put(
        "/thread/:id",
        isAuth,
        multerThreadMulti,
        threadController.editUserThread
    );
    router.get(
        "/thread/connected",
        isAuth,
        threadController.getAllConnectedThreadsByOffset
    );
    router.get(
        "/thread/by-post/:id",
        isAuth,
        threadController.getThreadByPostId
    );
    router.get(
        "/thread/by-poster/:id",
        isAuth,
        threadController.getAllThreadsByPosterId
    );
    router.put("/thread/like/:id", isAuth, threadController.likePost);
    router.post("/thread/comment", isAuth, threadController.postComment);
    router.put(
        "/thread/comment/like/:id",
        isAuth,
        threadController.likeComment
    );
    router.post("/thread/subcomment", isAuth, threadController.postSubcomment);
    router.put(
        "/thread/subcomment/like/:id",
        isAuth,
        threadController.likeSubcomment
    );
    router.delete("/thread/post/:id", isAuth, threadController.deleteUserPost);

    // OPTION ROUTES
    router.get("/option/location", isAuth, optionContoller.getAllLocations);
    router.get("/option/education", isAuth, optionContoller.getAllEducations);
    router.get("/option/industry", isAuth, optionContoller.getAllIndustries);
    router.get(
        "/option/control-level",
        isAuth,
        optionContoller.getAllControlLevels
    );
    router.get("/option/user-edit", isAuth, optionContoller.getUserEditOptions);
    router.get(
        "/option/company-edit",
        isAuth,
        optionContoller.getCompanyEditOptions
    );
    router.get("/option/job-edit", isAuth, optionContoller.getJobEditOptions);
    router.get(
        "/option/report-types",
        isAuth,
        optionContoller.getAllReportTypes
    );
    router.get(
        "/option/post-report-types",
        isAuth,
        optionContoller.getAllPostReportTypes
    );
    router.get(
        "/option/review-company",
        isAuth,
        optionContoller.getAllReviewOptions
    );

    // AUTH ROUTES
    router.get("/user/getAllUserInfo/:id", userController.getAllUserInfo);
    router.get("/byPostId/:id", userController.getPostInfoById);

    // ADMIN ROUTES
    router.post("/admin/login", adminController.loginAdmin);
    router.get("/admin/adminInfo/:id", isAuth, adminController.getAdminInfo);
    router.patch("/admin/updateAdmin/:id", isAuth, adminController.updateAdmin);

    router.get("/user/allUserList", userController.allUserList);
    //--------------------------------------update
    router.patch(
        "/admin/updateState/:id",
        isAuth,
        adminController.updateUserState
    );
    router.post(
        "/admin/PostUpdate/:id",
        isAuth,
        adminController.updatePostState
    );
    router.patch(
        "/admin/updateState/:id",
        isAuth,
        adminController.updateCompanyState
    );
    //--------------------------------------report
    router.get("/admin/reportList", isAuth, adminController.getReportList);
    router.get(
        "/admin/ReportInfo/:report_table/:report_id",
        isAuth,
        adminController.getReportInfo
    );
    router.patch(
        "/admin/ReportResolve/:report_table/:report_id",
        isAuth,
        adminController.resolveReport
    );
    //--------------------------------------
    router.get("/user/dashBoard", userController.dashBoard);
    router.get("/user/postByUser/:id", isAuth, userController.getPostByUser);
    router.get(
        "/company/getPostByCo/:id",
        isAuth,
        companyController.getPostByCo
    );
    router.get("/user/getLikeByPost/:id", isAuth, userController.getLikeByPost);
    router.get("/user/commentByPost/:id", isAuth, userController.commentByPost);

    // REPORT ROUTES
    router.post("/report/post/:id", isAuth, reportController.reportPost);
    router.post("/report/user/:id", isAuth, reportController.reportUser);
    router.post("/report/dashBoard", isAuth, reportController.reportCompany);

    // router.get(
    //     "/report/repoByPostId/:id",
    //     isAuth,
    //     reportController.repoByPostId
    // );

    // NOTIFICATION ROUTES
    router.get(
        "/notification/all",
        isAuth,
        notificationController.getNotifications
    );
    router.put(
        "/notification/all",
        isAuth,
        notificationController.readNotifications
    );
    router.delete(
        "/notification/:id",
        isAuth,
        notificationController.deleteNotification
    );
    //AICHATBOT ROUTE
    // router.get("/userFindJob", chatbotController.getJobByIndustryAndSalary);
    router.get(
        "/companyFindStaff",
        chatbotController.getStaffByEducationByIndustryByWorkExp
    );

    return router;
}
