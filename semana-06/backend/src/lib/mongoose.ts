// File Path: ./semana-06/backend/src/lib/mongoose.ts

import mongoose from 'mongoose';
import { logger } from '../config/logger.js';

/** Conecta a MongoDB. Falla rápido si no hay MONGO_URI. */
export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('error', (err) => logger.error(`MongoDB error: ${err.message}`));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

  await mongoose.connect(uri);
};

/** Desconecta limpiamente. Usado en tests (semana 09) y en shutdown. */
export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};