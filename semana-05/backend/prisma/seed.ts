// File Path: ./semana-05/backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Seed idempotente: borra y recrea. Ejecutable N veces sin duplicar. */
const main = async (): Promise<void> => {
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();

  const single = await prisma.roomType.create({
    data: { name: 'Single', description: 'Una cama individual', basePrice: 60 },
  });
  const double = await prisma.roomType.create({
    data: { name: 'Double', description: 'Dos camas matrimoniales', basePrice: 100 },
  });
  const suite = await prisma.roomType.create({
    data: { name: 'Suite', description: 'Sala + dormitorio', basePrice: 220 },
  });

  await prisma.room.createMany({
    data: [
      { roomNumber: '101', price: 65, capacity: 1, floor: 1, available: true,  roomTypeId: single.id },
      { roomNumber: '102', price: 65, capacity: 1, floor: 1, available: false, roomTypeId: single.id },
      { roomNumber: '201', price: 110, capacity: 2, floor: 2, available: true,  roomTypeId: double.id },
      { roomNumber: '202', price: 110, capacity: 2, floor: 2, available: true,  roomTypeId: double.id },
      { roomNumber: '301', price: 240, capacity: 4, floor: 3, available: false, roomTypeId: suite.id },
      { roomNumber: '302', price: 240, capacity: 4, floor: 3, available: true,  roomTypeId: suite.id },
    ],
  });

  process.stdout.write('Seed complete: 3 room types, 6 rooms\n');
};

main()
  .catch((err) => {
    process.stderr.write(`Seed failed: ${String(err)}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });