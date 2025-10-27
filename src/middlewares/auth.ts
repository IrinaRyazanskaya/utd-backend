import type { NextFunction, Request, Response } from "express";

import { apiConfig } from "../config.js";

function verifyAuthToken(request: Request, response: Response, next: NextFunction): void {
  const token = request.get("x-auth-token");

  if (token !== apiConfig.token) {
    response.sendStatus(401);
    return;
  }

  next();
}

export { verifyAuthToken };
