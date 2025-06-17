import { Request, Response } from "express";
import { InternalServerError } from "../../lib/errors/internal-server/internal-server.error";
import { TaskMethods } from "../../models/task/interface/task.methods";

export class TaskController {

  private task: TaskMethods;
  constructor(task: TaskMethods) {
    this.task = task
  }


  async getTask(req: Request, res: Response) {

    try {

      const response = await this.task.getTask(parseInt(req.params.id));

      res.status(response.statusCode).json(response);

    } catch (error) {
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