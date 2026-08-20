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
   
}
module.exports = new PostRepo();