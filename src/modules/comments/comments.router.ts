import express, { NextFunction, Request, Response } from "express";
import { CommentController } from "./comments.controller";
import auth, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.createComment,
);

export const commentRouter = router;
