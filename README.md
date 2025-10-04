1. Project Overview

This is a RESTful API for a blogging platform built using Node.js, Express, and MongoDB.
It allows users to:

Sign up and log in using JWT authentication

Create, edit, and delete blogs

Publish drafts

Read blogs (both logged-in and guest users)

Search, filter, and sort blogs

Track reading time and read count

Architecture: MVC (Model-View-Controller) pattern

2. Features

User Authentication: Signup, login with JWT (expires in 1 hour)

Blog Management: Create, update, delete, publish blogs

Blog States: Draft or Published

Read Tracking: read_count automatically updates when a blog is read

Reading Time Calculation

Pagination, Search, and Sorting

Tests: Endpoint tests included using Jest, Supertest, and Thunder Client on Visual studio code

3. Technologies Used

Backend: Node.js, Express

Database: MongoDB, Mongoose

Authentication: JWT

Testing: Jest, Supertest, ThunderClient

Other Tools: dotenv, bcryptjs, morgan

4. Installation & Setup

Clone the repository:

git clone https://github.com/yourusername/blog-api.git
cd blog-api


Install dependencies:

npm install


Create a .env file in the root:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h


Start the server:

npm run dev   # for development with nodemon
npm start     # for production

5. API Endpoints
Auth

POST /api/auth/signup → Sign up

POST /api/auth/login → Log in

Blogs

GET /api/blogs → List published blogs (search, filter, sort, paginate)

GET /api/blogs/:id → Get single blog (increments read_count)

POST /api/blogs → Create a blog (draft by default)

PUT /api/blogs/:id → Update blog (owner only)

DELETE /api/blogs/:id → Delete blog (owner only)

PATCH /api/blogs/:id/publish → Publish blog (owner only)

GET /api/blogs/user → Get list of logged-in user's blogs

6. Testing

Run all tests:

npm test


Tests are written using Jest and Supertest for API endpoints.

7. Folder Structure
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── tests/
├── app.js
└── server.js

8. Notes

JWT tokens expire after 1 hour

Blogs are searchable by title, tags, and author

Blogs are filterable by state and orderable by read_count, reading_time, and timestamp