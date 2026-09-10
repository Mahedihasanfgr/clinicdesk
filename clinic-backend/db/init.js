import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
const migrate = fs.readFileSync(path.join(__dirname, "migrate.sql"), "utf8");

const statements = [...schema.split(";"), ...migrate.split(";")]
  .map(s => s.trim())
  .filter(s => s.length > 0);

const client = await pool.connect();
try {
  for (const stmt of statements) {
    try {
      await client.query(stmt);
    } catch (err) {
      // Only skip duplicate object errors, throw everything else
      if (!err.message.includes("already exists")) {
        console.error("❌ Failed statement:", stmt.slice(0, 80));
        console.error("❌ Error:", err.message);
        process.exit(1);
      }
    }
  }
  console.log("✅ All tables created successfully");
} finally {
  client.release();
  process.exit(0);
}
