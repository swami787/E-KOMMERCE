import express from "express"
import { 
  adminLogin, 
  googleLogin, 
  login, 
  logOut, 
  registration,
  verifyEmail 
} from "../controller/authController.js"

const authRoutes = express.Router()

authRoutes.post("/registration", registration)
authRoutes.get("/verify-email", verifyEmail)
authRoutes.post("/login", login)
authRoutes.get("/logout", logOut)
authRoutes.post("/googlelogin", googleLogin)
authRoutes.post("/adminlogin", adminLogin)

export default authRoutes