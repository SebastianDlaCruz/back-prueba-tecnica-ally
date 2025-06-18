import jwt from 'jsonwebtoken';

export interface Payload {
  sub: string;
  name: string;
  email: string;
}
export class JwtService {

  static generateToken(payload: Payload) {
    return jwt.sign(payload, process.env.KEY_JWT as string, {
      expiresIn: '1m'
    });

  }

  static generateRefreshToken(payload: Payload) {
    return jwt.sign(payload, process.env.KEY_JWT as string, {
      expiresIn: '7d'
    });
  }

  static verify(token: string | undefined, fn: (err: jwt.VerifyErrors | null, payload: string | jwt.JwtPayload | undefined) => void) {

    if (token) {
      jwt.verify(token, process.env.KEY_JWT as string, fn);
    }

  }
}

