import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "clinicdb",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
    };

const pool = new Pool(config);

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ DB connection error:", err.message));

export default pool;
