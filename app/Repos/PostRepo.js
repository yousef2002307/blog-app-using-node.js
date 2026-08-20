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
   

      async all(userId){
        return await prisma.post.findMany({
            where : {
                userId
            },
            include:{
                user:{
                    select:{
                        name:true,
                        email:true,
                    }
                }
            },
               orderBy: {
            createdAt: 'desc'  // or 'asc'
        }
        });
    }
}
module.exports = new PostRepo();