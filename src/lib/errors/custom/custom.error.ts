import { Errors } from "../../enums/error.enum";

export class CustomError extends Error {

  message: string;
  statusCode: number;
  code_error: Errors;

  constructor(message: string, statusCode: number, code_error?: Errors) {
    super(message);
    this.message = message || 'error';
    this.statusCode = statusCode;
    this.code_error = code_error ?? Errors.NULL;
    Error.captureStackTrace(this, this.constructor);
  }

}