import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

const sql = fs.readFileSync(path.join(__dirname, "migrate.sql"), "utf8");
pool.query(sql)
  .then(() => { console.log("✅ Migration done"); process.exit(0); })
  .catch(err => { console.error("❌ Error:", err.message); process.exit(1); });
