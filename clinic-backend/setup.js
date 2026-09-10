import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

export async function setupDatabase() {
  const config = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || "clinicdb",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD,
      };

  const client = new pg.Client(config);

  await client.connect();
  const schemaPath = fs.existsSync(path.join(__dirname, "db/schema.sql"))
    ? path.join(__dirname, "db/schema.sql")
    : path.join(__dirname, "db/masterSchema.sql");

  const schema = fs.readFileSync(schemaPath, "utf8");
  const statements = schema.split(";").map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of statements) {
    await client.query(stmt);
  }
  console.log("✅ Single Database Schema Applied Successfully!");
  await client.end();
}

// If run directly from terminal: `node setup.js`
if (process.argv[1] && process.argv[1].endsWith("setup.js")) {
  setupDatabase().catch(err => {
    console.error("❌ Setup failed:", err.message);
    process.exit(1);
  });
}
