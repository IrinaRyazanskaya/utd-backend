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
});

const application = createApplication({
  authToken: apiConfig.token,
  mailTransporter,
});

application.listen(serverConfig.port, () => {
  console.log(`Server listening at http://localhost:${serverConfig.port}`);
});
