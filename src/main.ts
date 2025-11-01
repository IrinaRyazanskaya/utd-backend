import "dotenv/config";
import nodemailer from "nodemailer";

import { createApplication } from "./application.js";
import { apiConfig, mailConfig, serverConfig } from "./config.js";

const mailTransporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: true,
  auth: {
    user: mailConfig.username,
    pass: mailConfig.password,
  },
  from: mailConfig.sender,
  to: mailConfig.recipients,
});

const application = createApplication({
  authToken: apiConfig.token,
  mailTransporter,
});

application.listen(serverConfig.port, () => {
  console.log(`Server listening at http://localhost:${serverConfig.port}`);
});
