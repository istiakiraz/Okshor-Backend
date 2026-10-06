import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./posts.controller";
import { auth as betterAuth } from "../../lib/auth";

const router = express.Router();

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // get user session
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });

    if (!session || !roles.includes(session.user.role as UserRole)) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification required. Please verify your email!",
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role as UserRole,
      emailVerified: session.user.emailVerified,
    };

    next();
  };
};

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.createPost,
);

export const postRouter = router;
