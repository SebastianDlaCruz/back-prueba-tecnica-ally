

import { Response } from "express";
import { RowDataPacket } from "mysql2";
import { AuthenticationError } from "../../lib/errors/authentication/authentication.error";
import { ConflictError } from "../../lib/errors/conflict/conflict.error";
import { InternalServerError } from "../../lib/errors/internal-server/internal-server.error";
import { NotFoundError } from "../../lib/errors/not-found/not-found.error";
import { StateResponse } from "../../lib/interfaces/state.response.interface";
import { CookieService } from "../../services/cookie/cookie.service";
import { HastService } from "../../services/hast.service/hast.service";
import { JwtService } from "../../services/jwt/jwt.service";
import { Connection, ConnectionDBModel } from "../connection-db/connection-db.model";
import { AuthMethods, ResponseAuth } from "./interface/auth-methods.interface";

export interface InputsSingIn {
  email: string;
  password: string;
}

export interface InputSingUp extends InputsSingIn {
  username: string;
}

export interface Auth {
  uuid: string;
  username: string;
  email: string;
  password: string;
  session_start_date: Date;
  register_date: Date;
}

type authQuery = Auth & RowDataPacket;
export class AuthModel extends ConnectionDBModel implements AuthMethods {

  constructor(connection: Connection) {
    super(connection);
  }

  async singIn(inputs: InputsSingIn): Promise<ResponseAuth> {

    try {

      const [user] = await this.connection.method.query<authQuery[]>('SELECT uuid,username,email,password ,session_start_date , register_date  FROM Auth WHERE email = ?', [inputs.email]);


      if (!user[0]) {
        throw new NotFoundError('Usuario no encontrado');
      }

      const confirm = await HastService.compare(inputs.password, user[0].password);

      if (!confirm) {
        throw new InternalServerError('Las contraseñas no coinciden');
      }

      const [update] = await this.connection.method.query(
        'UPDATE Auth SET session_start_date = CURRENT_TIMESTAMP WHERE uuid = ?;',
        [user[0].uuid])

      if (!update) {
        throw new InternalServerError('Error al actualizar la fecha de session');
      }


      const token = JwtService.generateToken({
        sub: user[0].uuid,
        name: user[0].username,
        email: user[0].email
      })

      const refreshToken = JwtService.generateRefreshToken({
        sub: user[0].uuid,
        name: user[0].username,
        email: user[0].email
      })

      return {
        statusCode: 200,
        success: true,
        message: 'Éxito al Iniciar Session',
        token,
        refreshToken
      }


    } catch (error) {

      if (error instanceof InternalServerError || NotFoundError) {
        throw error;
      }

      throw new InternalServerError('Error al iniciar session')

    } finally {
      this.release();
    }

  }


  async singUp(inputs: InputSingUp): Promise<StateResponse> {
    try {

      const [exist] = await this.connection.method.query<authQuery[]>('SELECT * FROM Auth WHERE email = ?', [inputs.email]);

      if (exist[0]) {
        throw new ConflictError('El usuario ya se encuentra registrado');
      }


      const { email, username, password } = inputs;
      const hasPassword = await HastService.generateHast(password);

      const result = await this.connection.method.query('INSERT INTO Auth (username,email,password,register_date) VALUES (?,?,?, CURRENT_TIMESTAMP)', [username, email, hasPassword]);

      if (!result) {
        throw new InternalServerError('Error al registrar el usuario')
      }

      return {
        statusCode: 201,
        message: 'Usuario registrado',
        success: true
      }


    } catch (error) {

      if (error instanceof InternalServerError || ConflictError) {
        throw error;
      }

      throw new InternalServerError('Error al iniciar session')

    } finally {
      this.release();
    }
  }




  singOut(res: Response): StateResponse {

    CookieService.clearCookie(res);

    return {
      statusCode: 200,
      message: 'Existo al cerrar sesión',
      success: true
    }

  }

  refreshToken(token: string): ResponseAuth {

    try {

      const tokens = {
        token: '',
        refreshToken: ''
      }


      if (token.length < 0) throw new AuthenticationError('Necesita autorización');

      JwtService.verify(token, (err, payload) => {

        if (err) throw new AuthenticationError('Autorización fallida');

        if (!payload) throw new InternalServerError('Error en el payload');


        const customPayload = payload as {
          sub: string;
          name?: string;
          email?: string;
          [key: string]: any;
        };


        const token = JwtService.generateToken({
          sub: customPayload.sub,
          name: customPayload.name ?? '',
          email: customPayload.email ?? ''
        });

        const refreshToken = JwtService.generateRefreshToken({
          sub: customPayload.sub,
          name: customPayload.name ?? '',
          email: customPayload.email ?? ''
        })

        tokens.token = token;
        tokens.refreshToken = refreshToken;


      })

      return {
        statusCode: 200,
        message: 'Nuevos tokens generados',
        success: true,
        token: tokens.token,
        refreshToken: tokens.refreshToken
      }

    } catch (error) {

      if (error instanceof InternalServerError || AuthenticationError) {
        throw error;
      }

      throw new InternalServerError('Error al generar los tokens')
    } finally {
      this.release();
    }


  }


  async getUsers(page: number, limit: number) {
    try {


      const offset = (page - 1) * limit;


      const [users] = await this.connection.method.query<authQuery[]>(
        `SELECT 
        BIN_TO_UUID(uuid) AS uuid, 
        username, 
        email, 
        register_date 
       FROM Auth 
       LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      interface total {
        total: number
      }

      type itemQuery = total & RowDataPacket;


      const [totalCount] = await this.connection.method.query<itemQuery[]>(
        'SELECT COUNT(*) AS total FROM Auth'
      );

      const totalItems = totalCount[0].total;
      const totalPages = Math.ceil(totalItems / limit);

      if (page > totalPages && totalPages > 0) {
        throw new NotFoundError('La página solicitada no existe');
      }


      const basePath = '/api/v1/users?';
      const paginationLinks = {
        first: `${basePath}page=1&limit=${limit}`,
        last: `${basePath}page=${totalPages}&limit=${limit}`,
        prev: page > 1 ? `${basePath}page=${page - 1}&limit=${limit}` : null,
        next: page < totalPages ? `${basePath}page=${page + 1}&limit=${limit}` : null
      };

      return {
        statusCode: 200,
        success: true,
        message: 'Usuarios obtenidos exitosamente',
        data: users,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages,
          ...paginationLinks
        }
      };


    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Error al obtener todos los usuarios')
    } finally {
      this.release();
    }
  }

}