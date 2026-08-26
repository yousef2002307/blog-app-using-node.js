const prisma = require("../../prisma/client")

class UserRepo {
    async create(data, roleName = "user") {
        return await prisma.$transaction(async (tx) => {
            // Find role or create it if it does not exist
            const role = await tx.role.upsert({
                where: { name: roleName },
                update: {},
                create: { name: roleName }
            });

            // If it's the default 'user' role, ensure 'post:read' permission is linked if permission exists
            if (roleName === "user") {
                const readPermission = await tx.permission.findUnique({
                    where: { name: "post:read" }
                });

                if (readPermission) {
                    await tx.rolePermission.upsert({
                        where: {
                            roleId_permissionId: {
                                roleId: role.id,
                                permissionId: readPermission.id
                            }
                        },
                        update: {},
                        create: {
                            roleId: role.id,
                            permissionId: readPermission.id
                        }
                    });
                }
            }

            const user = await tx.user.create({
                data
            });

            await tx.userRole.create({
                data: {
                    userId: user.id,
                    roleId: role.id
                }
            });

            return user;
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