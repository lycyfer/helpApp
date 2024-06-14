import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { addApplicationToEmployee, allEmploy, createEmployeeAccount, deleteApplicationsAndEmployeeApplications, deleteEmployee, getAllEmployeeApplications, getAllEmployees, loginEmployee, logout, testController, updateEmployee, updateEmployeePhoto } from "../controllers/employ.controller.js"

const router = express.Router()

router.post("/employ", testController)
router.get("/employs", allEmploy)
router.delete("/employ/delete/:id", deleteEmployee)
router.post("/employ/create", createEmployeeAccount)
router.get("/employ/getAll", getAllEmployees)
router.post("/employ/login", loginEmployee)
router.put("/employ/update/:id", updateEmployee)
router.post("/employ/add", addApplicationToEmployee)
router.get("/employ/getAllApplication", getAllEmployeeApplications)
router.post("/employ/logout", logout)
router.put("/employ/updatePhoto/:id", updateEmployeePhoto)
router.delete("/employ/deleteApplications/:id", deleteApplicationsAndEmployeeApplications)
export default router