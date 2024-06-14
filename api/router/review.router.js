
import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { approveReview, createReview, deleteReview, getAllReviews } from "../controllers/rewiew.controller.js"



const router = express.Router()

router.post("/rew", createReview)
router.get("/getRev", getAllReviews)
router.delete('/delete/:id', deleteReview);
router.put("/:id/approve", approveReview);

export default router