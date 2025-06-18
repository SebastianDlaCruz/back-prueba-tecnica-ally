
import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { authenticateToken } from "../../lib/middleware/authenticate-token/authenticate-token.middleware";

export const authRouter = (authController: AuthController) => {


  const router = Router();

  router.post('/sing-in', (req, res) => {
    authController.singIn(req, res)
  });

  router.post('/sing-up', (req, res) => {

    authController.singUp(req, res)
  })


  router.post('/refresh-token', (req, res) => {
    authController.refreshToken(req, res)
  })


  router.get('/users', authenticateToken, (req, res) => {
    authController.getUsers(req, res);
  })

  return router;
}