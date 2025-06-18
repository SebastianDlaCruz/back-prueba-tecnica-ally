import { Errors } from "../../enums/error.enum";
import { CustomError } from "../custom/custom.error";

export class AuthenticationError extends CustomError {
  constructor(message?: string, code_error?: Errors) {
    super(message || 'Autenticación requerida', 401, code_error)
  }
}