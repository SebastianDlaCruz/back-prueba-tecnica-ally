import { Response } from "express";
import { cookieConfig } from "../../config/cookie/cookie.config";

export class CookieService {
  static saveToken(res: Response, token: string) {
    res.cookie('token', token, {
      ...cookieConfig,
      maxAge: 15 * 60 * 1000,
    });
  }

  static saveRefreshToken(res: Response, token: string) {
    res.cookie('refresh-token', token, {
      ...cookieConfig,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

  }

  static clearCookie(res: Response) {
    res.clearCookie('token');
    res.clearCookie('refresh-token')
  }

}