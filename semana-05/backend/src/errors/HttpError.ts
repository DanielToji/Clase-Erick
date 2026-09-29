// File Path: ./semana-03/backend/src/errors/HttpError.ts

/**
 * Error controlado con status HTTP asociado.
 * En la Semana 04 evoluciona a `AppError` incorporando `isOperational`.
 */
export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, name: string, message: string) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}