import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type { SentMessageInfo } from "nodemailer";

import { mailConfig } from "../config";

type SendMailPayload = {
  subject: string;
  text: string;
  attachments?: Mail.Attachment[];
};

type Attachment = Mail.Attachment;

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
