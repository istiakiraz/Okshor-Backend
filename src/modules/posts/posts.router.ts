import express from "express";
import { PostController } from "./posts.controller";

const router = express.Router();

router.post("/", PostController.createPost);

export const postRouter = router;
