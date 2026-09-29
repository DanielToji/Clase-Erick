// File Path: ./semana-03/backend/src/types.ts

/** Tipos de habitación soportados por el hotel. */
export type RoomType = 'single' | 'double' | 'suite' | 'presidential';

/** Entidad de dominio principal. */
export interface Room {
  id: number;
  roomNumber: string;
  type: RoomType;
  price: number;
  available: boolean;
  createdAt: string;
}

/** Payload de creación: identidad y timestamp los asigna el repositorio. */
export type CreateRoomInput = Omit<Room, 'id' | 'createdAt'>;

/** Payload de actualización parcial. */
export type UpdateRoomInput = Partial<CreateRoomInput>;

/** Contrato de listado paginado. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** Contrato de respuesta para un único recurso. */
export interface SingleResponse<T> {
  data: T;
}

/** Contrato de error uniforme para toda la API. */
export interface ErrorResponse {
  error: string;
  message: string;
}