import express from "express";
const router = express.Router();

// Controller
import prescriptionCtrl from "../controllers/prescriptionController.js";

// Routes
router.get("/form", prescriptionCtrl.form);
router.post("/create_pdf", prescriptionCtrl.createPdf);

export default router;
