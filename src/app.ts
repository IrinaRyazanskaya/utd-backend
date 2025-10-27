import multer from "multer";
import express from "express";

import { orderCall } from "./handlers/calls.js";
import { applyRequest } from "./handlers/requests.js";
import { verifyAuthToken } from "./middlewares/auth.js";

function createApp() {
  const app = express();
  const upload = multer({ storage: multer.memoryStorage() });

  app.use(express.json());
  app.use(verifyAuthToken);

  app.post("/api/calls", orderCall);
  app.post("/api/requests", upload.single("order"), applyRequest);

  return app;
}

export { createApp };
