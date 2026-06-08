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
