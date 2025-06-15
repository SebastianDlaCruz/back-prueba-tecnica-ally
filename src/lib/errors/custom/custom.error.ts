export class CustomError extends Error {

  message: string;
  statusCode: number;


  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message || 'error';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

}