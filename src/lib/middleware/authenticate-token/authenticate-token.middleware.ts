import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '../../../services/jwt/jwt.service';
import { Errors } from '../../enums/error.enum';
interface AuthenticatedRequest extends Request {
  auth?: {
    payload: JwtPayload;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader?.split(' ')[1];


  if (!authHeader || !authHeader?.startsWith("Bearer ")) res.status(403).json({
    message: 'Sin cabecera',
    success: false,
    code_error: Errors.AUTHORIZATION_REQUIRED
  });

  if (!token) res.status(401).json({
    statusCode: 401,
    message: 'Sin Autorización',
    success: false,
    code_error: Errors.AUTHORIZATION_REQUIRED
  })


  JwtService.verify(token, (err, payload) => {

    if (err) {
      return res.status(401).json({ error: 'Token expirado', code_error: Errors.EXPIRED_TOKEN });
    }


    req.auth = {
      payload: payload as JwtPayload
    }

    next();
  })


} 