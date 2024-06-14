import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { login, logout, register } from "../controllers/admin.controller.js"


const router = express.Router()

router.post("/adminUser", register)
router.post("/adminUser/login", login)
router.post("/adminUser/logout", logout)
export default router