import express from "express";
import {
  fetchSignatureFields,
  saveSignatureFields,
} from "../controllers/signatureFieldsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/save", verifyToken, saveSignatureFields);
router.get("/:documentId", verifyToken, fetchSignatureFields);

export default router;
