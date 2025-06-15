import { PoolConnection } from "mysql2/promise";

export interface Connection {
  method: PoolConnection
}
export class ConnectionDBModel {
  protected connection: Connection;
  constructor(connection: Connection) {
    this.connection = connection;
  }

  protected release() {
    if (this.connection.method) {
      this.connection.method.release();
    }
  }
}