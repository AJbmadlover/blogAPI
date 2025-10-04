// src/routes/blogRoutes.js

const express = require('express');
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  publishBlog,
  getUserBlogs,
} = require('../controllers/blogController');

const { requireAuth } = require('../middlewares/auth');

// Public routes
router.get('/', getBlogs);           // List published blogs
router.get('/:id', getBlogById);     // Get single blog

// Private routes (owner only)
router.post('/', requireAuth, createBlog);          // Create new blog
router.put('/:id', requireAuth, updateBlog);       // Update blog
router.delete('/:id', requireAuth, deleteBlog);    // Delete blog
router.patch('/:id/publish', requireAuth, publishBlog); // Publish blog
router.get('/user/myblogs', requireAuth, getUserBlogs); // Get logged-in user's blogs

module.exports = router;
