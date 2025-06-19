
import dotenv from 'dotenv';
import mysql, { createPool } from 'mysql2/promise';
dotenv.config();

const {
  MYSQLHOST,
  MYSQLUSER,
  MYSQLPORT,
  MYSQLPASSWORD,
  MYSQLDATABASE } = process.env;


export const config = {
  host: MYSQLHOST,
  user: MYSQLUSER,
  port: parseInt(MYSQLPORT || '3306'),
  password: MYSQLPASSWORD,
  database: MYSQLDATABASE,
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