import { CustomError } from "../custom/custom.error";

export class ConflictError extends CustomError {
  constructor(message?: string) {
    super(message || 'conflicto', 409);
  }
}