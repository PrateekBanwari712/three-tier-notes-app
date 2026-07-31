import { Router } from "express";
import { addNote, deleteNote, getnotes } from "../controller/notes.controller.js";

const router = Router();

router.get("/", getnotes);
router.post("/", addNote);
router.delete("/:id", deleteNote);

export default router;
