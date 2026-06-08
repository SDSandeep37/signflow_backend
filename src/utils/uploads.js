import path from "path";
import { promises as fs } from "fs";
import multer from "multer";

const normalizePath = (filePath) => filePath.replaceAll("\\", "/");

const allowedDocumentMimeTypes = new Set([
  "application/msword",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedDocumentExtensions = new Set([".doc", ".docx", ".pdf"]);

const createUploadError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const documentFileFilter = (request, file, callback) => {
  const mimetype = file.mimetype?.toLowerCase();
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    !allowedDocumentMimeTypes.has(mimetype) &&
    !allowedDocumentExtensions.has(extension)
  ) {
    return callback(
      createUploadError("Only PDF, DOC, and DOCX files are allowed"),
      false,
    );
  }

  callback(null, true);
};

const createFileName = (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const name =
    path
      .basename(file.originalname, extension)
      .trim()
      .replace(/[^a-z0-9_-]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "upload";
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  return `${name}-${uniqueName}${extension}`;
};

const createUploader = (uploadPath, fieldName, fileFilter, options = {}) => {
  const storage = multer.diskStorage({
    destination: async (request, file, callback) => {
      try {
        await fs.mkdir(uploadPath, { recursive: true });
        callback(null, uploadPath);
      } catch (error) {
        callback(error);
      }
    },
    filename: (request, file, callback) => {
      callback(null, createFileName(file));
    },
  });

  const upload = multer({
    storage,
    fileFilter,
    limits: options.limits,
  });

  if (Array.isArray(fieldName)) {
    const fields = fieldName.map((name) => ({
      name,
      maxCount: options.maxCount || 1,
    }));

    return (request, response, next) => {
      upload.fields(fields)(request, response, (error) => {
        if (error) {
          return next(error);
        }

        request.file = Object.values(request.files || {})[0]?.[0];
        next();
      });
    };
  }

  return upload.single(fieldName);
};

const getUploadedFile = (file) => {
  if (!file) {
    return false;
  }

  return {
    path: normalizePath(file.path),
    name: file.filename,
    mimetype: file.mimetype,
    size: file.size,
  };
};

export const createDocumentUploader = (
  uploadPath,
  fieldName = "document",
  options = {},
) =>
  createUploader(uploadPath, fieldName, documentFileFilter, {
    ...options,
    limits: {
      fileSize: 25 * 1024 * 1024,
      ...options.limits,
    },
  });

export const getUploadedDocument = getUploadedFile;
