import { Pool } from "pg";

//create a connection pool to the database
export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//table creation if not exist
export async function initialiseDatabaseTable() {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255),
      original_filename VARCHAR(255) NOT NULL,
      path VARCHAR(255) NOT NULL,
      full_url VARCHAR(255) NOT NULL,
      mimetype VARCHAR(100) NOT NULL,
      size INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS signature_fields  (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      page_number INTEGER NOT NULL,
      x_percent DECIMAL(5,2) NOT NULL,
      y_percent DECIMAL(5,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Database tables initialized successfully");
}
