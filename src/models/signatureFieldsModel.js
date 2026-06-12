import { dbPool } from "../config/db.js";

export async function createSignatureFields(documentId, fields) {
  //connect to db
  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM signature_fields WHERE document_id = $1", [
      documentId,
    ]);

    for (const field of fields) {
      await client.query(
        `
        INSERT INTO signature_fields (document_id,page_number,x_percent,y_percent)
        VALUES ($1,$2,$3,$4)`,
        [documentId, field.page, field.xPercent, field.yPercent],
      );
    }
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

//get all the signature field for a document

export async function getSignatureFields(documentId) {
  try {
    const { rows } = await dbPool.query(
      `
      SELECT * FROM signature_fields WHERE document_id = $1
      ORDER BY created_at ASC;
      `,
      [documentId],
    );
    //removing updated_at from each signature_field
    /* rows.forEach((field) => {
      delete updated_at;
    });
    // this will throw SyntaxError: Delete of an unqualified identifier in strict mode.
    */

    return rows;
  } catch (error) {
    throw error;
  }
}
