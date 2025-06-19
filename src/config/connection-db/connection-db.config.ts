
import mysql, { createPool } from 'mysql2/promise';
const {
  HOST,
  USER,
  PORTDB,
  PASSWORD,
  DATABASE } = process.env;


export const config = {
  host: HOST,
  user: USER,
  port: parseInt(PORTDB || '3306'),
  password: PASSWORD,
  database: DATABASE,
  connectionLimit: 10,
  queueLimit: 0,
} as const;

export const getConnectionDB = async (): Promise<mysql.PoolConnection> => {

  try {
    console.log(config)
    const pool = createPool(config)
    const connection = await pool.getConnection();

    return connection;

  } catch (error) {
    console.log(error);
    throw error;
  }

}