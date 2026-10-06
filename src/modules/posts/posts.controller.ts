import { Request, Response } from "express";
import { PostService } from "./posts.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await PostService.createPost(req.body, user.id as string);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchString = typeof search === "string" ? search : undefined;
    
    const tags = req.query.tags ? (req.query.tags as string).split(",") : []

    const result = await PostService.getAllPost({ search: searchString , tags });

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
};
