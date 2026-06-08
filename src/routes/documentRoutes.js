import express from "express";
import { uploadDocument } from "../upload.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createUploadedDocument,
  getLatestDocument,
  getAllDocuments,
} from "../controllers/documentController.js";
const router = express.Router();

router.post("/upload", verifyToken, uploadDocument, createUploadedDocument);
router.get("/latest", verifyToken, getLatestDocument);
router.get("/all", verifyToken, getAllDocuments);
export default router;
