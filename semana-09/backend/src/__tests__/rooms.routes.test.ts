// File Path: ./semana-09/backend/src/__tests__/rooms.routes.test.ts

import request from 'supertest';
import { app } from '../app.js';
import { startMemoryDB, stopMemoryDB, clearDB } from './helpers/db.js';
import { createUser, createRoomType, createRoom } from './helpers/factories.js';

beforeAll(async () => {
  await startMemoryDB();
});

afterAll(async () => {
  await stopMemoryDB();
});

afterEach(async () => {
  await clearDB();
});

/** Registra un usuario y devuelve un agent con cookies + userId. */
const authAgent = async (role: 'user' | 'admin' = 'user') => {
  const agent = request.agent(app);
  const email = `${role}-${Date.now()}-${Math.random()}@test.com`;
  const res = await agent
    .post('/api/v1/auth/register')
    .send({ email, password: 'Password123!' });

  // Si queremos admin, promovemos vía modelo (atajo de test)
  if (role === 'admin') {
    const { UserModel } = await import('../models/user.model.js');
    await UserModel.updateOne({ email }, { role: 'admin' });
    // Volvemos a loguear para reflejar el nuevo rol en el token
    await agent.post('/api/v1/auth/logout');
    await agent.post('/api/v1/auth/login').send({ email, password: 'Password123!' });
  }

  return { agent, userId: res.body.data.user.id as string };
};

describe('Rooms routes (integration)', () => {
  describe('GET /api/v1/rooms', () => {
    it('returns 200 with an empty array initially (public)', async () => {
      const res = await request(app).get('/api/v1/rooms');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.total).toBe(0);
      expect(res.body.page).toBe(1);
    });

    it('returns 200 with a populated array', async () => {
      const { user } = await createUser();
      const type = await createRoomType();
      await createRoom(String(type._id), String(user._id), { roomNumber: '101' });

      const res = await request(app).get('/api/v1/rooms');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].roomNumber).toBe('101');
      expect(res.body.data[0].roomTypeId).toMatchObject({ name: type.name });
    });
  });

  describe('POST /api/v1/rooms', () => {
    it('returns 401 without a token', async () => {
      const type = await createRoomType();

      const res = await request(app)
        .post('/api/v1/rooms')
        .send({
          roomNumber: '999',
          price: 100,
          capacity: 2,
          floor: 1,
          roomTypeId: String(type._id),
        });

      expect(res.status).toBe(401);
    });

    it('returns 201 with valid data and a user cookie', async () => {
      const { agent } = await authAgent('user');
      const type = await createRoomType();

      const res = await agent.post('/api/v1/rooms').send({
        roomNumber: '303',
        price: 130,
        capacity: 2,
        floor: 3,
        roomTypeId: String(type._id),
      });

      expect(res.status).toBe(201);
      expect(res.body.data.roomNumber).toBe('303');
      expect(res.body.data.addedBy).toMatchObject({ role: 'user' });
    });

    it('returns 400 with invalid payload (Zod)', async () => {
      const { agent } = await authAgent('user');

      const res = await agent.post('/api/v1/rooms').send({
        roomNumber: '',
        price: -50,
        capacity: 0,
        floor: -1,
        roomTypeId: 'not-an-object-id',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      expect(Array.isArray(res.body.issues)).toBe(true);
    });

    it('returns 409 on duplicate roomNumber', async () => {
      const { agent, userId } = await authAgent('user');
      const type = await createRoomType();
      await createRoom(String(type._id), userId, { roomNumber: '303' });

      const res = await agent.post('/api/v1/rooms').send({
        roomNumber: '303',
        price: 130,
        capacity: 2,
        floor: 3,
        roomTypeId: String(type._id),
      });

      expect(res.status).toBe(409);
    });

    it('returns 400 when roomTypeId does not exist', async () => {
      const { agent } = await authAgent('user');

      const res = await agent.post('/api/v1/rooms').send({
        roomNumber: '404',
        price: 100,
        capacity: 2,
        floor: 1,
        roomTypeId: '507f1f77bcf86cd799439011',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/does not exist/);
    });
  });

  describe('GET /api/v1/rooms/:id', () => {
    it('returns 200 with an existing room', async () => {
      const { user } = await createUser();
      const type = await createRoomType();
      const room = await createRoom(String(type._id), String(user._id));

      const res = await request(app).get(`/api/v1/rooms/${room._id}`);

      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(String(room._id));
    });

    it('returns 404 with a nonexistent but valid id', async () => {
      const res = await request(app).get('/api/v1/rooms/507f1f77bcf86cd799439011');
      expect(res.status).toBe(404);
    });

    it('returns 400 with a malformed id', async () => {
      const res = await request(app).get('/api/v1/rooms/xyz');
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/v1/rooms/:id', () => {
    it('returns 200 when the owner updates', async () => {
      const { agent, userId } = await authAgent('user');
      const type = await createRoomType();
      const room = await createRoom(String(type._id), userId, { price: 100 });

      const res = await agent
        .patch(`/api/v1/rooms/${room._id}`)
        .send({ price: 150 });

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(150);
    });

    it('returns 403 when a non-owner user updates', async () => {
      const owner = await createUser();
      const { agent } = await authAgent('user');
      const type = await createRoomType();
      const room = await createRoom(String(type._id), String(owner.user._id));

      const res = await agent
        .patch(`/api/v1/rooms/${room._id}`)
        .send({ price: 999 });

      expect(res.status).toBe(403);
    });

    it('returns 200 when an admin updates someone else\'s room', async () => {
      const owner = await createUser();
      const { agent } = await authAgent('admin');
      const type = await createRoomType();
      const room = await createRoom(String(type._id), String(owner.user._id));

      const res = await agent
        .patch(`/api/v1/rooms/${room._id}`)
        .send({ available: false });

      expect(res.status).toBe(200);
      expect(res.body.data.available).toBe(false);
    });

    it('returns 404 when the room does not exist', async () => {
      const { agent } = await authAgent('user');

      const res = await agent
        .patch('/api/v1/rooms/507f1f77bcf86cd799439011')
        .send({ price: 100 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/rooms/:id', () => {
    it('returns 403 when a user (non-admin) tries to delete', async () => {
      const { agent, userId } = await authAgent('user');
      const type = await createRoomType();
      const room = await createRoom(String(type._id), userId);

      const res = await agent.delete(`/api/v1/rooms/${room._id}`);
      expect(res.status).toBe(403);
    });

    it('returns 204 when an admin deletes', async () => {
      const owner = await createUser();
      const { agent } = await authAgent('admin');
      const type = await createRoomType();
      const room = await createRoom(String(type._id), String(owner.user._id));

      const res = await agent.delete(`/api/v1/rooms/${room._id}`);
      expect(res.status).toBe(204);
    });

    it('returns 404 when the room does not exist', async () => {
      const { agent } = await authAgent('admin');
      const res = await agent.delete('/api/v1/rooms/507f1f77bcf86cd799439011');
      expect(res.status).toBe(404);
    });
  });
});