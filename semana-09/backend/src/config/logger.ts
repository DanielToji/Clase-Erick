// File Path: ./semana-09/backend/src/config/logger.ts

import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

export const logger = winston.createLogger({
  level: isTest ? 'error' : isProduction ? 'warn' : 'http',
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
  transports: [new winston.transports.Console({ silent: isTest })],
});

if (isProduction) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  );
}

export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};