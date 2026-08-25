require('dotenv').config();
const prisma = require('./client');


async function main() {
    // ── 1. Create permissions ─────────────────────────────────────────────
    const permissionNames = [
        'post:create',
        'post:edit',
        'post:delete',
        'post:read',
        'user:manage',
    ];

    for (const name of permissionNames) {
        await prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log('✅ Permissions seeded');

    // ── 2. Create roles ───────────────────────────────────────────────────
    const roles = {
        admin:  ['post:create', 'post:edit', 'post:delete', 'post:read', 'user:manage'],
        editor: ['post:create', 'post:edit', 'post:read'],
        user:   ['post:read'],
    };

    for (const [roleName, perms] of Object.entries(roles)) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });

        for (const permName of perms) {
            const permission = await prisma.permission.findUnique({ where: { name: permName } });
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
                update: {},
                create: { roleId: role.id, permissionId: permission.id },
            });
        }
    }

    console.log('✅ Roles seeded');
    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
