import { CustomError } from './custom-error'; 

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to DB';
  statusCode = 500;

  constructor() {
    super('Error connecting to DB');

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}