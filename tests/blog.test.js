// src/tests/blog.test.js

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Blog = require('../models/Blog');

let token;
let blogId;

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a test user and get JWT
  const user = await User.create({
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
    password: 'password123',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'jane@example.com',
    password: 'password123',
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Blog API', () => {
  test('Create blog - POST /api/blogs', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Blog',
        description: 'Test blog',
        body: 'This is the body of my first blog',
        tags: ['test', 'blog'],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.blog).toHaveProperty('title', 'My First Blog');
    blogId = res.body.blog._id;
  });

  test('Get all published blogs - GET /api/blogs', async () => {
    const res = await request(app).get('/api/blogs');
    expect(res.statusCode).toBe(200);
    expect(res.body.blogs).toBeInstanceOf(Array);
  });

  test('Publish blog - PATCH /api/blogs/:id/publish', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${blogId}/publish`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.blog).toHaveProperty('state', 'published');
  });

  test('Get single blog - GET /api/blogs/:id', async () => {
    const res = await request(app).get(`/api/blogs/${blogId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('read_count', 1);
  });
});
