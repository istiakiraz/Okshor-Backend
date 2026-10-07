import express from "express";
import { postRouter } from "./modules/posts/posts.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"
import { commentRouter } from "./modules/comments/comments.router";

const app = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:4000",
  credentials: true
}))

app.use(express.json());

app.all('/api/auth/*splat', toNodeHandler(auth));

// route route
app.get("/", (req, res) => {
  res.send("Where Every Word Matters. - Okshor");
});

app.use("/posts", postRouter);

app.use("/comments", commentRouter);

export default app;
