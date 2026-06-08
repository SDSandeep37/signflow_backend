import path from "path";
import { fileURLToPath } from "url";
import {
  createDocumentUploader,
  getUploadedDocument,
} from "./utils/uploads.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const documentUploadPath = path.resolve(__dirname, "../uploads/documents");

export const uploadDocument = createDocumentUploader(
  documentUploadPath,
  "document",
);

export { createDocumentUploader, getUploadedDocument };
