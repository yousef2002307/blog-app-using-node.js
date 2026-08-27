const prisma = require("../../../prisma/client")

class UserRepo {
    async findAll(roleNames = ["admin", "editor"], pagination = {}) {
        let roles = roleNames;
        let options = pagination;

        // Support calling findAll({ page, limit }) directly
        if (!Array.isArray(roleNames) && typeof roleNames === "object" && roleNames !== null) {
            options = roleNames;
            roles = ["admin", "editor"];
        }

        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 10;
        const skip = (page - 1) * limit;

        const where = {
            roles: {
                some: {
                    role: {
                        name: {
                            in: roles
                        }
                    }
                }
            }
        };

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    roles: {
                        include: {
                            role: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" }
            }),
            prisma.user.count({ where })
        ]);

        return { users, total };
    }
    async create(data, roleName = "admin") {
        return await prisma.$transaction(async (tx) => {
            const role = await tx.role.upsert({
                where: { name: roleName },
                update: {},
                create: { name: roleName }
            });

            const user = await tx.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    roles: {
                        create: {
                            roleId: role.id
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    roles: {
                        include: {
                            role: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            });

            return user;
        });
    }
}

module.exports = new UserRepo();
