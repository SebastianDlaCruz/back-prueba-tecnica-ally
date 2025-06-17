import { CustomError } from "../custom/custom.error";

export class AuthenticationError extends CustomError {
  constructor(message?: string) {
    super(message || 'Autenticación requerida', 401)
  }
}