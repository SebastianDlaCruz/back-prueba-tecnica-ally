import { CustomError } from "../custom/custom.error";

export class NotFoundError extends CustomError {

  constructor(message?: string) {
    super(message || 'Elemento no encontrado', 404);
  }
} 