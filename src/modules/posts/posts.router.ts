import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./posts.controller";
import auth, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/", PostController.getAllPost);

router.get(
  "/my-post",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.getMyPost,
);

router.get("/:id", PostController.getPostById);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.createPost,
);

router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.updatePost,
);

router.delete(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.deletePost,
);

export const postRouter = router;
