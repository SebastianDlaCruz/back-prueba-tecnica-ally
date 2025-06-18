
import mysql, { createPool } from 'mysql2/promise';
import { InternalServerError } from '../../lib/errors/internal-server/internal-server.error';
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
    const pool = createPool(config)
    const connection = await pool.getConnection();

    return connection;

  } catch (error) {
    console.log(error);
    throw new InternalServerError('Error al conectar a la base de datos');
  }

}