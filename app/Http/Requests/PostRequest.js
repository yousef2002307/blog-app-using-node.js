const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

module.exports = { createPostSchema };
