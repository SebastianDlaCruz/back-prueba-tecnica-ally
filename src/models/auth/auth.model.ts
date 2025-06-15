import { NotFoundError } from "@lib/index";
import { Connection, ConnectionDBModel } from "@models/connection-db/connection-db.model";
import { QueryResult } from "mysql2";

export interface InputsSingIn {
  email: string;
  password: string;
}


type authQuery = InputsSingIn & QueryResult;
export class AuthModel extends ConnectionDBModel {

  constructor(connection: Connection) {
    super(connection);
  }

  async singIn(auth: InputsSingIn) {

    try {

      const exist = await this.connection.method.query('SELECT * FROM Auth WHERE email = ?', [auth.email]);

      if (!exist[0]) {
        throw new NotFoundError('Usuario no encontrado');
      }




    } catch (error) {

    }

  }


  singUp() {

  }

  singOut() {

  }



}