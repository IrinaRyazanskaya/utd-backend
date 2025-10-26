import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";

import { mailConfig } from "../config.js";

type Attachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

type SendMailPayload = {
  subject: string;
  text: string;
  attachments?: Attachment[];
};

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: true,
  auth: {
    user: mailConfig.username,
    pass: mailConfig.password,
  },
});

function sendMail(payload: SendMailPayload): Promise<SentMessageInfo> {
  return transporter.sendMail({
    from: mailConfig.sender,
    to: mailConfig.recipients,
    ...payload,
  });
}

export { sendMail };
export type { Attachment, SendMailPayload };
