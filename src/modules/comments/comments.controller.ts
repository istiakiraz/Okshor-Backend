import { Request, Response } from "express";
import { CommentService } from "./comments.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    req.body.authorId = user?.id;

    const result = await CommentService.createComment(req.body);

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: "Comment creation failed",
      details: err,
    });
  }
};

export const CommentController = {
  createComment,
};
