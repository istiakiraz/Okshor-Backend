import { type Request, type Response, type NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  //PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields";
  } //PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because required data not found.";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "An unknown database error occurred.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err?.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed";
    }
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;
