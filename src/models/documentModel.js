import { dbPool } from "../config/db.js";
export async function createDocument(
  ownerId,
  title,
  originalFilename,
  path,
  mimetype,
  size,
  fullurl,
) {
  try {
    const result = await dbPool.query(
      `INSERT INTO documents (owner_id, title, original_filename, path, mimetype, size, full_url) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [ownerId, title, originalFilename, path, mimetype, size, fullurl],
    );
    const document = result.rows[0];
    // removing some informations
    delete document.created_at;
    delete document.updated_at;
    return document;
  } catch (error) {
    throw error;
  }
}

//get the latest document of a user
export async function getLatestDocumentByUserId(userId) {
  try {
    const result = await dbPool.query(
      `SELECT * FROM documents WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId],
    );
    const document = result.rows[0];
    if (!document) {
      return null;
    }
    // removing some informations
    delete document.created_at;
    delete document.updated_at;
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

//get all documents of a user
export async function getAllDocumentsByUserId(userId) {
  try {
    const result = await dbPool.query(
      `SELECT * FROM documents WHERE owner_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    // removing some informations
    result.rows.forEach((document) => {
      delete document.created_at;
      delete document.updated_at;
    });
    return result.rows;
  } catch (error) {
    throw error;
  }
}
