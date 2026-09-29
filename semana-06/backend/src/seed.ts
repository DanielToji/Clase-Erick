// File Path: ./semana-06/backend/src/seed.ts

import { connectDB, disconnectDB } from './lib/mongoose.js';
import { RoomTypeModel } from './models/room-type.model.js';
import { RoomModel } from './models/room.model.js';

const main = async (): Promise<void> => {
  await connectDB();

  // Orden obligatorio: hijos primero, padres después.
  await RoomModel.deleteMany({});
  await RoomTypeModel.deleteMany({});

  const [single, double, suite] = await RoomTypeModel.create([
    { name: 'Single', description: 'Una cama individual', basePrice: 60 },
    { name: 'Double', description: 'Dos camas matrimoniales', basePrice: 100 },
    { name: 'Suite', description: 'Sala + dormitorio', basePrice: 220 },
  ]);

  await RoomModel.create([
    { roomNumber: '101', price: 65, capacity: 1, floor: 1, available: true, roomTypeId: single._id },
    { roomNumber: '102', price: 65, capacity: 1, floor: 1, available: false, roomTypeId: single._id },
    { roomNumber: '201', price: 110, capacity: 2, floor: 2, available: true, roomTypeId: double._id },
    { roomNumber: '202', price: 110, capacity: 2, floor: 2, available: true, roomTypeId: double._id },
    { roomNumber: '301', price: 240, capacity: 4, floor: 3, available: false, roomTypeId: suite._id },
    { roomNumber: '302', price: 240, capacity: 4, floor: 3, available: true, roomTypeId: suite._id },
  ]);

  process.stdout.write('Seed complete: 3 room types, 6 rooms\n');
  await disconnectDB();
};

main().catch((err) => {
  process.stderr.write(`Seed failed: ${String(err)}\n`);
  process.exit(1);
});