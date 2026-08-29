const bcrypt = require("bcrypt");
const UserRepo = require("../../../Repos/Admin/UserRepo");
const { createAdminSchema } = require('../../Requests/CreateAdminRequest');
class AdminsController {
    async index(req, res, next) {
        try {
            const page  = parseInt(req.query.page)  || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { users, total } = await UserRepo.findAll(["admin", "editor"], { page, limit });
            const lastPage = Math.ceil(total / limit);
            return res.status(200).json({
                message: "Users fetched successfully",
                data: users,
                meta: {
                    total,
                    page,
                    limit,
                    lastPage,
                    hasNextPage: page < lastPage,
                    hasPrevPage: page > 1
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async createAdmin(req, res, next) {
        try {
            const parsed = createAdminSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(422).json({
                    errors: parsed.error.flatten().fieldErrors,
                });
            }
            const { name, email, password } = parsed.data;

            const existingUser = await UserRepo.findByEmail(email);
            if (existingUser) {
                return res.status(422).json({
                    errors: {
                        email: ["Email is already registered"],
                    },
                });
            }

            

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await UserRepo.create({ name, email, password: hashedPassword }, "admin");
            return res.status(201).json({
                message: "User created successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminsController();
