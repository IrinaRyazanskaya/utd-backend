import multer from "multer";
import express from "express";
import type { Transporter } from "nodemailer";

import { createOrderCallHandler } from "./handlers/calls.js";
import { createApplyRequestHandler } from "./handlers/requests.js";
import { createVerifyAuthToken } from "./middlewares/auth.js";

type ApplicationOptions = {
  authToken: string;
  mailTransporter: Transporter;
};

function createApplication({ authToken, mailTransporter }: ApplicationOptions) {
  const application = express();
  const upload = multer({ storage: multer.memoryStorage() });

  application.use(express.json());
  application.use(createVerifyAuthToken({ authToken }));

  application.post(
    "/api/calls",
    createOrderCallHandler({
      mailTransporter,
    }),
  );
  application.post(
    "/api/requests",
    upload.single("order"),
    createApplyRequestHandler({
      mailTransporter,
    }),
  );

  return application;
}

export { createApplication };
export type { ApplicationOptions };
