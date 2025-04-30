import express from "express";
import { AdminLogin, Login, Register } from "../controller/userController.js";

const userRoutes = express.Router();

userRoutes.post("/login" , Login);
userRoutes.post("/register" , Register);
userRoutes.post("/admin" , AdminLogin);


export default userRoutes;

