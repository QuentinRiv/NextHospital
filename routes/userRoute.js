import express from "express";
const router = express.Router();

// Controller
import userCtrl from "../controllers/userController.js";

// Routes
router.get("/connect", userCtrl.connect);
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/logout", userCtrl.logout);
router.get("/getinfo", userCtrl.getInfo);
export default router;
