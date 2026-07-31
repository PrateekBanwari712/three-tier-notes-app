import express from "express";
import { getuser, login, signup } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.get("/get-user", getuser);

export default router;