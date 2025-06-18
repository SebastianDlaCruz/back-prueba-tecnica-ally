import { Errors } from "../../enums/error.enum";
import { CustomError } from "../custom/custom.error";

export class InternalServerError extends CustomError {
  constructor(message?: string, code_error?: Errors) {
    super(message || 'Error del servidor', 500, code_error);
  }
}