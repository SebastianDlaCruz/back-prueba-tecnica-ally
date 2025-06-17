import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '../../../services/jwt/jwt.service';
interface AuthenticatedRequest extends Request {
  auth?: {
    payload: JwtPayload;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader?.split(' ')[1];

  if (!authHeader || !authHeader?.startsWith("Bearer ")) res.status(401).json({
    message: 'Sin cabecera',
    success: false
  })

  if (!token) res.status(401).json({
    statusCode: 401,
    message: 'Sin Autorización',
    success: false
  })


  JwtService.verify(token, (err, payload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ statusCode: 403, error: 'Token expired', code: 'TOKEN_EXPIRED' });
      }

      return res.status(403).json({ error: 'Token invalido' });
    }


    req.auth = {
      payload: payload as JwtPayload
    }

    next();
  })


} 