// File Path: ./semana-06/backend/src/repositories/rooms.repository.ts

import { RoomModel } from '../models/room.model.js';

export interface RoomFilters {
  available?: boolean;
  roomTypeId?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

/** Lista paginada con `roomType` populado y total real. */
export const findAll = async (filters: RoomFilters, { page, limit }: Pagination) => {
  const query: Record<string, unknown> = {};
  if (filters.available !== undefined) query.available = filters.available;
  if (filters.roomTypeId) query.roomTypeId = filters.roomTypeId;

  const [data, total] = await Promise.all([
    RoomModel.find(query)
      .populate('roomTypeId')
      .sort({ roomNumber: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    RoomModel.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

/** Detalle con relación populada. */
export const findById = async (id: string) =>
  RoomModel.findById(id).populate('roomTypeId').lean();

/** Búsqueda por `roomNumber` para validación de unicidad. */
export const findByRoomNumber = async (roomNumber: string) =>
  RoomModel.findOne({ roomNumber }).lean();

export const create = async (data: {
  roomNumber: string;
  price: number;
  capacity: number;
  floor: number;
  available: boolean;
  roomTypeId: string;
}) => {
  const doc = await RoomModel.create(data);
  return RoomModel.findById(doc._id).populate('roomTypeId').lean();
};

export const update = async (
  id: string,
  data: Partial<{
    roomNumber: string;
    price: number;
    capacity: number;
    floor: number;
    available: boolean;
    roomTypeId: string;
  }>,
) =>
  RoomModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('roomTypeId')
    .lean();

export const remove = async (id: string) =>
  RoomModel.findByIdAndDelete(id).lean();