import * as SignatureFields from "../models/signatureFieldsModel.js";

export async function saveSignatureFields(request, response) {
  try {
    if (!request.body) {
      return response.status(400).json({
        success: false,
        message: "Details of document and signature fields required",
      });
    }
    const { documentId, fields } = request.body;
    if (!documentId) {
      return response.status(400).json({
        success: false,
        message: "Document identity required",
      });
    }
    const result = await SignatureFields.createSignatureFields(
      documentId,
      fields,
    );
    if (result) {
      return response.status(201).json({
        success: true,
        message: "Signature fields saved successfully",
        result,
      });
    }
  } catch (error) {
    console.error("Error saving signature fields:", error);
    return response
      .status(500)
      .json({ success: false, message: "Failed to save signature fields" });
  }
}

export async function fetchSignatureFields(request, response) {
  try {
    const { documentId } = request.params;
    if (!documentId) {
      return response.status(400).json({
        success: false,
        message: "Document identity required",
      });
    }
    const fields = await SignatureFields.getSignatureFields(documentId);
    return response.json({
      success: true,
      fields,
    });
  } catch (error) {
    console.error("Error getting signature fields:", error);
    return response
      .status(500)
      .json({ success: false, message: "Failed to fetch signature fields" });
  }
}
