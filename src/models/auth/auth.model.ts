

import { RowDataPacket } from "mysql2";
import { Errors } from "../../lib/enums/error.enum";
import { AuthenticationError } from "../../lib/errors/authentication/authentication.error";
import { ConflictError } from "../../lib/errors/conflict/conflict.error";
import { InternalServerError } from "../../lib/errors/internal-server/internal-server.error";
import { NotFoundError } from "../../lib/errors/not-found/not-found.error";
import { StateResponse } from "../../lib/interfaces/state.response.interface";
import { HastService } from "../../services/hast.service/hast.service";
import { JwtService } from "../../services/jwt/jwt.service";
import { Connection, ConnectionDBModel } from "../connection-db/connection-db.model";
import { AuthMethods, PaginatedResponse, ResponseAuth } from "./interface/auth-methods.interface";

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
        throw new NotFoundError('Usuario no encontrado', Errors.USER_NOT_FOUND);
      }

      const confirm = await HastService.compare(inputs.password, user[0].password);

      if (!confirm) {
        throw new InternalServerError('Las contraseñas no coinciden', Errors.INCORRECT_PASSWORDS);
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

      throw new InternalServerError('Error al iniciar session', Errors.ERROR_SING_IN)

    } finally {
      this.release();
    }

  }


  async singUp(inputs: InputSingUp): Promise<StateResponse> {
    try {

      const [exist] = await this.connection.method.query<authQuery[]>('SELECT * FROM Auth WHERE email = ?', [inputs.email]);

      if (exist[0]) {
        throw new ConflictError('El usuario ya se encuentra registrado', Errors.USER_EXISTE);
      }


      const { email, username, password } = inputs;
      const hasPassword = await HastService.generateHast(password);

      const result = await this.connection.method.query('INSERT INTO Auth (username,email,password,register_date) VALUES (?,?,?, CURRENT_TIMESTAMP)', [username, email, hasPassword]);

      if (!result) {
        throw new InternalServerError('Error al registrar el usuario', Errors.ERROR_SING_UP)
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

      throw new InternalServerError('Error al crear el usuario', Errors.ERROR_SING_UP);

    } finally {
      this.release();
    }
  }




  refreshToken(token: string): ResponseAuth {

    try {

      const tokens = {
        token: '',
        refreshToken: ''
      }


      if (token.length < 0) throw new AuthenticationError('Necesita autorización', Errors.AUTHORIZATION_REQUIRED);

      JwtService.verify(token, (err, payload) => {

        if (err) throw new AuthenticationError('Autorización fallida', Errors.FAIL_AUTHORIZATION);

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

      throw new InternalServerError('Error al generar los tokens', Errors.ERROR_GENERATE_TOKENS)
    } finally {
      this.release();
    }


  }


  async getUsers(page: number, limit?: number): Promise<PaginatedResponse> {
    try {

      interface total {
        total: number
      }

      type itemQuery = total & RowDataPacket;

      const [totalCount] = await this.connection.method.query<itemQuery[]>(
        'SELECT COUNT(*) AS total FROM Auth'
      );
      const totalItems = totalCount[0].total;


      const effectiveLimit = limit ?? totalItems;

      const offset = (page - 1) * effectiveLimit;

      const [users] = await this.connection.method.query<authQuery[]>(
        `SELECT BIN_TO_UUID(uuid) AS uuid, username, email, register_date ,session_start_date
       FROM Auth 
       LIMIT ? OFFSET ?`,
        [effectiveLimit, offset]
      );

      const totalPages = Math.ceil(totalItems / effectiveLimit);
      if (page > totalPages && totalPages > 0) {
        throw new NotFoundError('La página solicitada no existe');
      }


      const basePath = '/users?';
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
          itemsPerPage: effectiveLimit,
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