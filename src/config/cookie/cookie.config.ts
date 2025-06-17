import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === 'pro';
export const cookieConfig: CookieOptions = {
  httpOnly: true, // Impide acceso desde JavaScript
  secure: isProduction, // Solo HTTPS en producción
  sameSite: isProduction ? 'strict' : 'lax', // Protección CSRF

};