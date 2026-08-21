const prisma = require("../../prisma/client")

class PostRepo{
    async create(data){
        return await prisma.post.create({
            data
        });
    }
    async findById(id,userId){
        return await prisma.post.findUnique({
            where : {
                id,
                userId
            },
            include:{
                user:{
                    select:{
                        name:true,
                        email:true,
                    }
                }
            }
        });
    }
  async delete(id,userId){
        return await prisma.post.delete({
            where : {
                id,
                userId
            },
            include:{
                user:{
                    select:{
                        name:true,
                        email:true,
                    }
                }
            }
        });
    }
   

    async all(userId, { page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;

        const [posts, total] = await prisma.$transaction([
            prisma.post.findMany({
                where: { userId },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.post.count({ where: { userId } })
        ]);

        return { posts, total };
    }

    async update(data){
        return await prisma.post.update({
            where : {
                id : data.id
            },
            include:{
                user:{
                    select:{
                        name:true,
                        email:true,
                    }
                }
            },
            data
        });
    }
}
module.exports = new PostRepo();