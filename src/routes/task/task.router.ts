import { Router } from "express";
import { TaskController } from "../../controllers/task/task.controller";
import { authenticateToken } from "../../lib/middleware/authenticate-token/authenticate-token.middleware";

export const taskRouter = (taskController: TaskController) => {

  const router = Router();

  router.get('/:id', authenticateToken, (req, res) => {
    taskController.getTask(req, res)

  })
  return router

}