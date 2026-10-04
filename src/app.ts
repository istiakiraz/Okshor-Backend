import express from "express";
import { postRouter } from "./modules/posts/posts.router";

const app = express();

app.use(express.json());

// route route
app.get("/", (req, res) => {
  res.send("Where Every Word Matters. - Okshor");
});

app.use("/posts", postRouter);

export default app;
