const express = require('express');

const app = express();

require('dotenv').config();

// Middleware
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

// Routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Body parser
app.use(express.json());

// Logger middleware
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// 404 route for unmatched endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
