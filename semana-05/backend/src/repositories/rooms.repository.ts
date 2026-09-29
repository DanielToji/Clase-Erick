// File Path: ./semana-03/backend/src/repositories/rooms.repository.ts

import type { CreateRoomInput, Room, UpdateRoomInput } from '../types.js';

/** Store en memoria. Única fuente de verdad durante la Semana 03. */
const rooms: Room[] = [
  {
    id: 1,
    roomNumber: '101',
    type: 'single',
    price: 65,
    available: true,
    createdAt: new Date('2024-01-10T09:00:00Z').toISOString(),
  },
  {
    id: 2,
    roomNumber: '204',
    type: 'double',
    price: 110,
    available: true,
    createdAt: new Date('2024-02-05T14:20:00Z').toISOString(),
  },
  {
    id: 3,
    roomNumber: '505',
    type: 'suite',
    price: 240,
    available: false,
    createdAt: new Date('2024-03-01T11:45:00Z').toISOString(),
  },
];

let nextId = 4;

/** Devuelve copia defensiva de todas las habitaciones. */
export const findAll = async (): Promise<Room[]> => {
  return rooms.map((room) => ({ ...room }));
};

/** Busca por id; devuelve copia o `undefined`. */
export const findById = async (id: number): Promise<Room | undefined> => {
  const found = rooms.find((room) => room.id === id);
  return found ? { ...found } : undefined;
};

/** Busca por número de habitación (clave de unicidad del dominio). */
export const findByRoomNumber = async (
  roomNumber: string,
): Promise<Room | undefined> => {
  const found = rooms.find((room) => room.roomNumber === roomNumber);
  return found ? { ...found } : undefined;
};

/** Inserta una habitación asignando identidad y marca temporal. */
export const create = async (input: CreateRoomInput): Promise<Room> => {
  const room: Room = {
    id: nextId++,
    ...input,
    createdAt: new Date().toISOString(),
  };
  rooms.push(room);
  return { ...room };
};

/** Actualización parcial; devuelve copia o `undefined`. */
export const update = async (
  id: number,
  input: UpdateRoomInput,
): Promise<Room | undefined> => {
  const index = rooms.findIndex((room) => room.id === id);
  if (index === -1) return undefined;

  const current = rooms[index];
  const updated: Room = {
    ...current,
    ...input,
    id: current.id,
    createdAt: current.createdAt,
  };
  rooms[index] = updated;
  return { ...updated };
};

/** Elimina por id; `true` si existía. */
export const remove = async (id: number): Promise<boolean> => {
  const index = rooms.findIndex((room) => room.id === id);
  if (index === -1) return false;
  rooms.splice(index, 1);
  return true;
};