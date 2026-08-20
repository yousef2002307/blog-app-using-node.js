const PostRepo = require("../../Repos/PostRepo");
const { createPostSchema } = require('../Requests/PostRequest');

class PostController {
  async store(req,res,next){
  // inside your controller method:
const parsed = createPostSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(422).json({
    errors: parsed.error.flatten().fieldErrors,
  });
}
const { title, content } = parsed.data;
const data = {
  title,
  content,
  userId: req.user.id,
};
let createdpost = await PostRepo.create(data);
   console.log(data)
    return res.status(201).json({
        "message" : "ppoost created",
        "data" : createdpost
    })

  }
    async show(req,res,next){
      const id = parseInt(req.params.id);
      const post = await PostRepo.findById(id,parseInt(req.user.id));
      if(!post){
        return res.status(404).json({
          "message" : "Post not found"
        })
      }
      return res.status(200).json({
        "message" : "Post found",
        "data" : post
      })
    }

     async delete(req,res,next){
      const id = parseInt(req.params.id);
      const post = await PostRepo.findById(id,parseInt(req.user.id));
      if(!post){
        return res.status(404).json({
          "message" : "Post not found"
        })
      }
        let deletepost = await PostRepo.delete(id,parseInt(req.user.id));
      return res.status(200).json({
        "message" : "Post deleted",
        "data" : deletepost
      })
    }
   
   
}

module.exports = new PostController();
