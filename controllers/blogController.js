// src/controllers/blogController.js

const Blog = require('../models/Blog');
const User = require('../models/user');
const { calculateReadingTime } = require('../utils/readingTime');

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;

    const blog = await Blog.create({
      title,
      description,
      body,
      tags,
      author: req.user.id, // from auth middleware
      state: 'draft',
      read_count: 0,
      reading_time: calculateReadingTime(body),
    });

    res.status(201).json({ message: 'Blog created', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL PUBLISHED BLOGS (with pagination, search, filter, sort)
exports.getBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 20, state = 'published', search, sortBy, order } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = { state };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort({ [sortBy || 'timestamp']: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ page, limit, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET SINGLE BLOG
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');

    if (!blog || blog.state !== 'published') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment read_count
    blog.read_count += 1;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const { title, description, tags, body } = req.body;

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }

    await blog.save();
    res.status(200).json({ message: 'Blog updated', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUBLISH BLOG
exports.publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    blog.state = 'published';
    await blog.save();

    res.status(200).json({ message: 'Blog published', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BLOGS BY LOGGED-IN USER
exports.getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;

    const query = { author: req.user.id };
    if (state) query.state = state;

    const blogs = await Blog.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ page, limit, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
