import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.SQL_USER || process.env.DB_USER || 'postgres',
  host: process.env.SQL_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.SQL_DB_NAME || process.env.DB_DATABASE || 'task_manager',
  password: process.env.SQL_PASSWORD || process.env.DB_PASSWORD || 'password',
  port: process.env.SQL_PORT || process.env.DB_PORT || 5432,
});

export default pool;
