// File Path: ./semana-09/backend/src/__tests__/auth.routes.test.ts

import request from 'supertest';
import { app } from '../app.js';
import { startMemoryDB, stopMemoryDB, clearDB } from './helpers/db.js';
import { createUser } from './helpers/factories.js';

beforeAll(async () => {
  await startMemoryDB();
});

afterAll(async () => {
  await stopMemoryDB();
});

afterEach(async () => {
  await clearDB();
});

describe('Auth routes (integration)', () => {
  describe('POST /api/v1/auth/register', () => {
    it('returns 201 and sets both cookies on success', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'new@test.com', password: 'Password123!' });

      expect(res.status).toBe(201);
      expect(res.body.data.user.email).toBe('new@test.com');
      expect(res.body.data.user.role).toBe('user');

      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.startsWith('access_token='))).toBe(true);
      expect(cookies.some((c) => c.startsWith('refresh_token='))).toBe(true);
      expect(cookies.every((c) => c.includes('HttpOnly'))).toBe(true);
    });

    it('returns 400 when the payload is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: 'short' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      expect(Array.isArray(res.body.issues)).toBe(true);
    });

    it('returns 409 when the email is already registered', async () => {
      await createUser({ email: 'taken@test.com' });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'taken@test.com', password: 'Password123!' });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Conflict');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('returns 200 and cookies with valid credentials', async () => {
      await createUser({ email: 'login@test.com', password: 'Password123!' });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com', password: 'Password123!' });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('returns 401 with invalid credentials', async () => {
      await createUser({ email: 'login@test.com', password: 'Password123!' });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com', password: 'wrong-password' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('returns 401 without a cookie', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });

    it('returns 200 with the authenticated user when the cookie is present', async () => {
      const agent = request.agent(app);
      await agent
        .post('/api/v1/auth/register')
        .send({ email: 'me@test.com', password: 'Password123!' });

      const res = await agent.get('/api/v1/auth/me');

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('me@test.com');
      expect(res.body.data).not.toHaveProperty('passwordHash');
    });
  });

  describe('refresh + logout flow', () => {
    it('rotates the refresh token and rejects the old one', async () => {
      const agent = request.agent(app);
      const reg = await agent
        .post('/api/v1/auth/register')
        .send({ email: 'rot@test.com', password: 'Password123!' });

      const firstRefreshCookie = (reg.headers['set-cookie'] as unknown as string[])
        .find((c) => c.startsWith('refresh_token='))!;

      const refresh = await agent.post('/api/v1/auth/refresh');
      expect(refresh.status).toBe(200);

      // Reintento con el refresh viejo (guardamos solo la cookie como string)
      const stolenAgent = request.agent(app);
      const stolen = await stolenAgent
        .post('/api/v1/auth/refresh')
        .set('Cookie', firstRefreshCookie);

      expect(stolen.status).toBe(401);
    });

    it('clears cookies on logout and refuses later refreshes', async () => {
      const agent = request.agent(app);
      await agent
        .post('/api/v1/auth/register')
        .send({ email: 'bye@test.com', password: 'Password123!' });

      const logout = await agent.post('/api/v1/auth/logout');
      expect(logout.status).toBe(204);

      const after = await agent.post('/api/v1/auth/refresh');
      expect(after.status).toBe(401);
    });
  });
});