const prisma = require("../../prisma/client")

class UserRepo {
    async create(data) {
        return await prisma.user.create({
            data
        });
    }

    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    /**
     * Find a user by email and eagerly load their roles + permissions.
     * Returns the user with an extra flat `permissions` string array:
     *   e.g. ['post:create', 'post:read', ...]
     */
    async findByEmailWithPermissions(email) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: { permission: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) return null;

        // Flatten nested structure → ['post:create', 'post:read', ...]
        user.permissions = [
            ...new Set(
                user.roles.flatMap((ur) =>
                    ur.role.permissions.map((rp) => rp.permission.name)
                )
            )
        ];

        return user;
    }
}

module.exports = new UserRepo();