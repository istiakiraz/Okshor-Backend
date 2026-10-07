import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./posts.controller";
import auth, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/", PostController.getAllPost);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.createPost,
);

router.get("/:id", PostController.getPostById);

export const postRouter = router;
