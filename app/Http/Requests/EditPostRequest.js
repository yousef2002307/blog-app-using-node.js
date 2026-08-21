const { z } = require('zod');

const EditPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255).optional(),
  content: z.string().min(10, 'Content must be at least 10 characters').optional(),
});

module.exports = { EditPostSchema };
