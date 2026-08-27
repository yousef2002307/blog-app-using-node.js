const { z } = require('zod');

const createAdminSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = { createAdminSchema };
