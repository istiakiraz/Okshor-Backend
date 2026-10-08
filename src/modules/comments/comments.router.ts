import express, { NextFunction, Request, Response } from "express";
import { CommentController } from "./comments.controller";
import auth, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/:commentId", CommentController.getCommentById);
router.get("/author/:authorId", CommentController.getCommentByAuthor);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.createComment,
);

router.delete(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.deleteComment,
);

router.patch(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.updateComment,
);

export const commentRouter = router;
