import express from "express";
import { authController } from "../server";

export const authRoutes = express.Router();

authRoutes.post("/register", (req, res) => authController.register(req, res));
authRoutes.get("/logout", (req, res) => authController.logout(req, res));
authRoutes.post("/login", (req, res) => authController.login(req, res));
authRoutes.get("/login/google", (req, res) =>
    authController.loginGoogle(req, res)
);
