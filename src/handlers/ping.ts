import type { Request, Response } from "express";

function createPingHandler() {
  return function ping(_request: Request, response: Response): void {
    response.status(200).type("text/plain").send("OK");
  };
}

export { createPingHandler };
