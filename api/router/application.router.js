import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { createApplication, deleteApplication, getAllApplications } from "../controllers/application.controller.js"

const router = express.Router()

router.post("/send", createApplication)
router.get("/applications", getAllApplications)
router.delete("/delete/:id", deleteApplication)
// router.get("/employs", allEmploy)
export default router