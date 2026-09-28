// File Path: ./semana-04/backend/src/config/logger.ts

import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Logger central. Nivel `http` en desarrollo (Morgan lo usa),
 * nivel `warn` en producción para no inundar stdout.
 * Formato colorizado en desarrollo, JSON en producción.
 */
export const logger = winston.createLogger({
  level: isProduction ? 'warn' : 'http',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}] ${message}`;
        }),
      ),
  transports: [new winston.transports.Console()],
});

if (isProduction) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  );
}

/** Stream consumido por Morgan para redirigir cada request a Winston. */
export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};