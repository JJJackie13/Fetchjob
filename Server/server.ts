import express from "express";
import expressSession from "express-session";
import http from "http";
import { Server as SocketIO } from "socket.io";
import grant from "grant";
import Knex from "knex";
import { runSample } from "./dialog-sample";

import { env } from "./env";
import { logger } from "./logger";
import { setSocketIO } from "./socketio";
import { createRouter } from "./route";
// import { isAuth } from "./middlewares/auth";

// CONTROLLER & SERVICE TYPES
import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./services/AuthService";
import { UserController } from "./controllers/UserController";
import { UserService } from "./services/UserService";
import { NetworkController } from "./controllers/NetworkController";
import { NetworkService } from "./services/NetworkService";
import { JobController } from "./controllers/JobController";
import { JobService } from "./services/JobService";
import { SearchService } from "./services/SearchService";
import { SearchController } from "./controllers/SearchController";
import { ChatService } from "./services/ChatService";
import { ChatController } from "./controllers/ChatController";
import { CompanyService } from "./services/CompanyService";
import { CompanyController } from "./controllers/CompanyController";
import { PersonalService } from "./services/PersonalService";
import { PersonalController } from "./controllers/PersonalController";
import { ThreadController } from "./controllers/ThreadController";
import { ThreadService } from "./services/ThreadService";
import { OptionService } from "./services/OptionService";
import { OptionController } from "./controllers/OptionController";
import { AdminService } from "./services/AdminService";
import { AdminController } from "./controllers/AdminController";

import cors from "cors";
import { ReportService } from "./services/ReportService";
import { ReportController } from "./controllers/ReportController";
import { NotificationController } from "./controllers/NotificationController";
import { NotificationService } from "./services/NotificationService";
import { ChatBotService } from "./services/ChatBotService";
import { ChatBotController } from "./controllers/ChatbotController";
// import { isAuth } from "./middlewares/auth";
// import { searchRoutes } from "./router/searchRoutes";
//import { SearchServices } from "./services/SearchService";
//import { SearchController } from "./controllers/SearchController";

const PORT = env.PORT || 8080;
const app = express();
const server = new http.Server(app);
export const io = new SocketIO(server, {
    cors: {
        origin: "*",
    },
});

// KNEX SETUP
const knexConfigs = require("./knexfile");
const configMode = env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);

setSocketIO(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = expressSession({
    secret: "xy2-31x@.@??##err*u",
    resave: true,
    saveUninitialized: true,
});
app.use(sessionMiddleware);
const wrap = (middleware: any) => (socket: any, next: any) =>
    middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

const grantExpress = grant.express({
    defaults: {
        origin: process.env.GRANT_ORIGIN,
        transport: "session",
        state: true,
    },
    google: {
        key: process.env.GOOGLE_CLIENT_ID || "",
        secret: process.env.GOOGLE_CLIENT_SECRET || "",
        scope: ["profile", "email"],
        callback: "/auth/login/google",
    },
});
app.use(grantExpress as express.RequestHandler);

app.use((req, res, next) => {
    if (req.path === "/") {
        logger.info(`USER ID => ${req.session["userId"]}`);
        logger.info(`EMAIL => ${req.session["userEmail"]}`);
    }
    next();
});

// CONTROLLER & SErVICE SETUP
export const authService = new AuthService(knex);
export const authController = new AuthController(authService);
export const adminService = new AdminService(knex);
export const adminController = new AdminController(adminService);
export const userService = new UserService(knex);
export const userController = new UserController(userService);
export const companyService = new CompanyService(knex);
export const companyController = new CompanyController(companyService);
export const personalController = new PersonalController(
    new PersonalService(knex)
);
export const jobController = new JobController(new JobService(knex));
export const searchController = new SearchController(new SearchService(knex));
export const networkService = new NetworkService(knex);
export const networkController = new NetworkController(networkService);
export const chatController = new ChatController(new ChatService(knex));
export const threadController = new ThreadController(new ThreadService(knex));
export const optionService = new OptionService(knex);
export const optionContoller = new OptionController(optionService);
export const reportService = new ReportService(knex);
export const reportController = new ReportController(reportService);
export const notificationService = new NotificationService(knex);
export const notificationController = new NotificationController(
    notificationService
);
export const chatbotService = new ChatBotService(knex);
export const chatbotController = new ChatBotController(chatbotService);

let router = createRouter({
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
});

app.use(router);
app.post("/message-to-bot", async function (req, res) {
    const { content } = req.body;
    // const userId = parseInt(req["user"].id);
    const responseFromDf = await runSample(content);
    console.log("responseFromDf.data = ", responseFromDf);
    res.json({ message: responseFromDf });
});
// app.use("/auth", AR.authRoutes);
// app.use("/", AR.searchRoutes);
// app.use("/user", AR.userRoutes);
// app.use("/job", AR.jobRoutes);
// app.use("/network", AR.networkRoutes);
// app.use("/chat", isAuth, AR.chatRoutes);
// app.use("/", AR.companyRoutes);
// app.use("/", AR.personalRoutes);
app.use(express.static("uploads/user"));
app.use(express.static("uploads/company"));
app.use(express.static("uploads/thread"));

server.listen(PORT, () => {
    logger.info(`Server準備好喇： http://localhost:${PORT}/`);
});
