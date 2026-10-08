import { Request, Response } from "express";
import { PostService } from "./posts.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSortingHelper";
import { UserRole } from "../../middlewares/authMiddleware";

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
    // search query params
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await PostService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getPostById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // if (!id || Array.isArray(id)) {
    //   throw new Error("Valid post id is required");
    // }

    const result = await PostService.getPostById(id);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req?.user;

    if (!user) {
      throw new Error("You are unauthorized!");
    }

    const result = await PostService.getMyPost(user?.id as string);

    res.status(200).json(result);
  } catch (err: any) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: "Post fetched failed",
      details: err,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req?.user;

    if (!user) {
      throw new Error("You are unauthorized!");
    }

    const { postId } = req.params;

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await PostService.deletePost(
      postId as string,
      user?.id as string,
      isAdmin,
    );

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: result,
    });
  } catch (err: any) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: "Post delete failed",
      details: err,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req?.user;

    if (!user) {
      throw new Error("You are unauthorized!");
    }

    const { postId } = req.params;

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await PostService.updatePost(
      postId as string,
      req.body,
      user?.id as string,
      isAdmin,
    );

    res.status(200).json(result);
  } catch (err: any) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: "Post update failed",
      details: err,
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await PostService.getStats();

    res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: result,
    });
  } catch (err: any) {
    console.log(err);

    res.status(400).json({
      success: false,
      error: "Stats fetched failed",
      details: err,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  getStats,
};
