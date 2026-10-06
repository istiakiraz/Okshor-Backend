import { Request, Response } from "express";
import { postService } from "./posts.service";

const createPost = async (req: Request, res: Response) => {
  try {

    console.log(req.user)

    const result = await postService.createPost(req.body);


    res.status(201).json({
        success : true,
        message: "Post created successfully",
        data: result
    })


  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const PostController = {
  createPost,
};
