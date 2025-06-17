import { RowDataPacket } from "mysql2";
import { InternalServerError } from "../../lib/errors/internal-server/internal-server.error";
import { Connection, ConnectionDBModel } from "../connection-db/connection-db.model";
import { ResponseTask, Task, TaskMethods } from "./interface/task.methods";


type TaskQuery = Task & RowDataPacket;

export class TaskModel extends ConnectionDBModel implements TaskMethods {
  constructor(connection: Connection) {
    super(connection);
  }

  async getTask(id_country: number): Promise<ResponseTask> {

    try {

      const [task] = await this.connection.method.query<TaskQuery[]>('SELECT * FROM Task WHERE id_country = ?', [id_country]);

      return {
        statusCode: 200,
        message: 'Éxito',
        success: true,
        data: task
      }

    } catch (error) {

      throw new InternalServerError('Error al obtener las tareas');

    } finally {
      this.release();
    }
  }

}