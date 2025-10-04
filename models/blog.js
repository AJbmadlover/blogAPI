const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    state: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: String, // e.g., "3 mins"
      default: '0 min',
    },
    tags: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Blog', blogSchema);
