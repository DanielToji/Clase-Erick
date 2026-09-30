// File Path: ./semana-09/backend/src/types.ts

export type RoomType = 'single' | 'double' | 'suite' | 'presidential';

export interface Room {
  id: number;
  roomNumber: string;
  type: RoomType;
  price: number;
  available: boolean;
  createdAt: string;
}

export type CreateRoomInput = Omit<Room, 'id' | 'createdAt'>;
export type UpdateRoomInput = Partial<CreateRoomInput>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: string;
  message: string;
}