import { Errors } from "../../enums/error.enum";
import { CustomError } from "../custom/custom.error";

export class NotFoundError extends CustomError {

  constructor(message?: string, code_error?: Errors) {
    super(message || 'Elemento no encontrado', 404, code_error);
  }
} 