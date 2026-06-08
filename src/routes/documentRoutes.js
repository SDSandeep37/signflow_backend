import express from "express";
import { uploadDocument } from "../upload.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { createUploadedDocument } from "../controllers/documentController.js";
const router = express.Router();

router.post("/upload", verifyToken, uploadDocument, createUploadedDocument);

export default router;
