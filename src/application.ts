import multer from "multer";
import express from "express";
import type { Transporter } from "nodemailer";

import { createOrderCallHandler } from "./handlers/calls.js";
import { createPingHandler } from "./handlers/ping.js";
import { createApplyRequestHandler } from "./handlers/requests.js";
import { createVerifyAuthToken } from "./middlewares/auth.js";

type ApplicationOptions = {
  authToken: string;
  mailTransporter: Transporter;
};

function createApplication({ authToken, mailTransporter }: ApplicationOptions) {
  const application = express();
  application.use(express.json());

  application.get("/api/ping", createPingHandler());

  const authTokenMiddleware = createVerifyAuthToken({ authToken });
  const uploadOrderMiddleware = multer({ storage: multer.memoryStorage() });

  application.post(
    "/api/calls",
    authTokenMiddleware,
    createOrderCallHandler({
      mailTransporter,
    }),
  );
  application.post(
    "/api/requests",
    authTokenMiddleware,
    uploadOrderMiddleware.single("order"),
    createApplyRequestHandler({
      mailTransporter,
    }),
  );

  return application;
}

export { createApplication };
export type { ApplicationOptions };
