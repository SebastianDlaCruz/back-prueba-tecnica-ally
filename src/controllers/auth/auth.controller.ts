
import { Request, Response } from "express";
import { AuthenticationError } from "../../lib/errors/authentication/authentication.error";
import { ConflictError } from "../../lib/errors/conflict/conflict.error";
import { InternalServerError } from "../../lib/errors/internal-server/internal-server.error";
import { NotFoundError } from "../../lib/errors/not-found/not-found.error";
import { authSchema } from "../../lib/schemas/auth.schema";
import { createAuthSchema } from "../../lib/schemas/create-auth.schema";
import { validSchema } from "../../lib/utils/validate-schema.util";
import { InputSingUp, InputsSingIn } from "../../models/auth/auth.model";
import { AuthMethods } from "../../models/auth/interface/auth-methods.interface";

export class AuthController {
  private auth: AuthMethods;
  constructor(auth: AuthMethods) {
    this.auth = auth;
  }

  async singIn(req: Request, res: Response) {

    const result = validSchema(authSchema, req.body);

    if (result.error) {
      res.status(400);
      res.json({
        error: JSON.parse(result.error.message)
      })
    }

    try {
      const response = await this.auth.singIn(result.data as InputsSingIn);

      res.status(response.statusCode).json(response)

    } catch (error) {

      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })
      }

      if (error instanceof InternalServerError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })
      }

    }

  }



  async singUp(req: Request, res: Response) {

    const result = validSchema(createAuthSchema, req.body);

    if (result.error) {
      res.status(400);
      res.json({
        error: JSON.parse(result.error.message)
      })
    }

    try {
      const response = await this.auth.singUp(result.data as InputSingUp);
      res.status(response.statusCode).json(response);

    } catch (error) {

      if (error instanceof ConflictError) {
        res.status(error.statusCode).json(
          {
            statusCode: error.statusCode,
            message: error.message,
            success: false
          }
        )
      }

      if (error instanceof InternalServerError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })
      }

    }
  }

  singOut(res: Response) {
    const response = this.auth.singOut(res);
    res.status(response.statusCode).json(response);
  }


  refreshToken(req: Request, res: Response) {


    try {

      const token = req.body.refreshToken;

      const response = this.auth.refreshToken(token);

      res.status(response.statusCode).json(response);

    } catch (error) {

      if (error instanceof AuthenticationError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })
      }

      if (error instanceof InternalServerError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })
      }
    }

  }

  async getUsers(req: Request, res: Response) {

    try {

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const response = await this.auth.getUsers(page, limit);

      res.status(response.statusCode).json({ response });

    } catch (error) {

      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })

      }

      if (error instanceof InternalServerError) {
        res.status(error.statusCode).json({
          statusCode: error.statusCode,
          message: error.message,
          success: false
        })

      }
    }
  }

}