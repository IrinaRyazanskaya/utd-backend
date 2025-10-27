import type { NextFunction, Request, Response } from "express";

type VerifyAuthTokenOptions = {
  authToken: string;
};

function createVerifyAuthToken({ authToken }: VerifyAuthTokenOptions) {
  return function verifyAuthToken(request: Request, response: Response, next: NextFunction): void {
    const token = request.get("x-auth-token");

    if (token !== authToken) {
      response.sendStatus(401);
      return;
    }

    next();
  };
}

export { createVerifyAuthToken };
export type { VerifyAuthTokenOptions };
