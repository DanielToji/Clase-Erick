// File Path: ./semana-09/backend/src/seed.ts

import { connectDB, disconnectDB } from './lib/mongoose.js';
import { UserModel } from './models/user.model.js';
import { RefreshTokenModel } from './models/refresh-token.model.js';
import { RoomTypeModel } from './models/room-type.model.js';
import { RoomModel } from './models/room.model.js';
import { hashPassword } from './utils/password.js';

const main = async (): Promise<void> => {
  await connectDB();

  await RoomModel.deleteMany({});
  await RoomTypeModel.deleteMany({});
  await RefreshTokenModel.deleteMany({});
  await UserModel.deleteMany({});

  const adminHash = await hashPassword('Admin123!');
  const userHash = await hashPassword('User123!');

  const [admin, user] = await UserModel.create([
    { email: 'admin@hotel.com', passwordHash: adminHash, role: 'admin' },
    { email: 'user@hotel.com', passwordHash: userHash, role: 'user' },
  ]);

  const [single, double, suite] = await RoomTypeModel.create([
    { name: 'Single', description: 'Una cama individual', basePrice: 60 },
    { name: 'Double', description: 'Dos camas matrimoniales', basePrice: 100 },
    { name: 'Suite', description: 'Sala + dormitorio', basePrice: 220 },
  ]);

  await RoomModel.create([
    { roomNumber: '101', price: 65, capacity: 1, floor: 1, available: true, roomTypeId: single._id, addedBy: admin._id },
    { roomNumber: '102', price: 65, capacity: 1, floor: 1, available: false, roomTypeId: single._id, addedBy: admin._id },
    { roomNumber: '201', price: 110, capacity: 2, floor: 2, available: true, roomTypeId: double._id, addedBy: user._id },
    { roomNumber: '202', price: 110, capacity: 2, floor: 2, available: true, roomTypeId: double._id, addedBy: user._id },
    { roomNumber: '301', price: 240, capacity: 4, floor: 3, available: false, roomTypeId: suite._id, addedBy: admin._id },
    { roomNumber: '302', price: 240, capacity: 4, floor: 3, available: true, roomTypeId: suite._id, addedBy: admin._id },
  ]);

  process.stdout.write('Seed complete: 2 users, 3 room types, 6 rooms\n');
  await disconnectDB();
};

main().catch((err) => {
  process.stderr.write(`Seed failed: ${String(err)}\n`);
  process.exit(1);
});