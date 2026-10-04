import { Request, Response } from "express";

const createPost = async (req: Request, res: Response) => {
//   res.send("Created a new post");

console.log({req, res})
};


export const PostController = {
    createPost
}