// File Path: ./semana-04/backend/src/errors/AppError.ts

/**
 * Error controlado con status HTTP e indicador de operacionalidad.
 * `isOperational = true` → error esperado (404, 409, …) que el handler reporta.
 * `isOperational = false` → error de programación; se enmascara como 500.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    name: string,
    message: string,
    isOperational = true,
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}