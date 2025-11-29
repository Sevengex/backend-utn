import { Router } from "express"
import userController from "../controllers/authController"

const authRoutes = Router()

// https://localhost:3000/auth
authRoutes.post("/register", userController.Register)
authRoutes.post("/login", userController.Login)

export default authRoutes 