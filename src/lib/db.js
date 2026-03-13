import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export default sql;

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      subcategory VARCHAR(100),
      original_price DECIMAL(10,2) NOT NULL,
      discount_price DECIMAL(10,2) NOT NULL,
      delivery_fee DECIMAL(10,2) DEFAULT 60,
      description TEXT,
      images TEXT[],
      available BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS carousel_images (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      title VARCHAR(255),
      subtitle VARCHAR(255),
      sort_order INT DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('DB initialized');
}
