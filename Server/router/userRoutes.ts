import express from "express";
import { userController } from "../server";
import { isAuth } from "../middlewares/auth";

export const userRoutes = express.Router();

userRoutes.get("/profile/:id", userController.getUserProfileById);
userRoutes.get("/relation/:id", userController.getFriendRelationStatusById);
userRoutes.get("/current_user", isAuth, userController.getCurrentUser);
userRoutes.put("/addFriend/:id", userController.addFriend);
// userRoutes.get("/relation/:id", userController.getFriendRelationStatusById);
userRoutes.post("/memo", userController.createPost);
userRoutes.get("/getPosts/:id", userController.getUserPosts);
userRoutes.get("/all", userController.getAllUsersByKeywords);
userRoutes.get("/education-options", userController.getEducationOptions);
userRoutes.put("/addLike/:id", isAuth, userController.likePost);
userRoutes.get("/user/getAllUserInfo/:id", userController.getAllUserInfo);
