import { CustomError } from "../custom/custom.error";

export class InternalServerError extends CustomError {
  constructor(message?: string) {
    super(message || 'Error del servidor', 500);
  }
}