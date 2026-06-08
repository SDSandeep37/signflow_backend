import * as Document from "../models/documentModel.js";
import { getUploadedDocument } from "../upload.js";

export async function createUploadedDocument(request, response) {
  try {
    if (!request.file) {
      return response.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    if (!request.body.title) {
      return response.status(400).json({
        success: false,
        message: "Document title is required",
      });
    }
    if (!request.user) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const { title } = request.body;
    const { id: ownerId } = request.user;
    const uploadedDocument = await getUploadedDocument(request.file);
    const fullUrl = `${process.env.BASE_URL}uploads/documents/${uploadedDocument.name}`;
    const document = await Document.createDocument(
      ownerId,
      title,
      uploadedDocument.name,
      uploadedDocument.path,
      uploadedDocument.mimetype,
      uploadedDocument.size,
      fullUrl,
    );
    return response.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    return response
      .status(500)
      .json({ success: false, message: "Failed to upload document" });
  }
}

// get the latest document of a user
export async function getLatestDocument(request, response) {
  try {
    if (!request.user) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const { id: userId } = request.user;
    const document = await Document.getLatestDocumentByUserId(userId);
    if (!document) {
      return response.status(404).json({
        success: false,
        message: "No documents found for this user",
      });
    }
    return response.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Error fetching latest document:", error);
    return response
      .status(500)
      .json({ success: false, message: "Failed to fetch latest document" });
  }
}

//get all documents of a user
export async function getAllDocuments(request, response) {
  try {
    if (!request.user) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const { id: userId } = request.user;
    const documents = await Document.getAllDocumentsByUserId(userId);
    return response.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching all documents:", error);
    return response
      .status(500)
      .json({ success: false, message: "Failed to fetch documents" });
  }
}
