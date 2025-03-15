import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @description Creates a PostgreSQL connection pool using environment variables.
 */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;
