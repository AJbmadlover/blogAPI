const request = require('supertest');

const app = require('../app');

const mongoose = require('mongoose');

const User = require('../models/User');

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth API', () => {
  const userData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  test('Signup - POST /api/auth/signup', async () => {
    const res = await request(app).post('/api/auth/signup').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('email', userData.email);
    expect(res.body).toHaveProperty('token');
  });

  test('Login - POST /api/auth/login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: userData.email,
      password: userData.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('Login with wrong password should fail', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: userData.email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });
});
