import { Errors } from "../../enums/error.enum";
import { CustomError } from "../custom/custom.error";

export class ConflictError extends CustomError {
  constructor(message?: string, code_error?: Errors) {
    super(message || 'conflicto', 409, code_error);
  }
}