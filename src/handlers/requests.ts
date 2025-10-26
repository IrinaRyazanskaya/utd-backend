import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type { SentMessageInfo } from "nodemailer";
import type { Request, Response } from "express";
import type { ParsedQs } from "qs";

import { mailConfig } from "../config";

type ApplyRequestBody = {
  name: unknown;
  phone: unknown;
  email: unknown;
  comment?: unknown;
};

type ValidationMessage = {
  message: string;
};

type ApplyRequestValidationErrors = Partial<Record<"name" | "phone" | "email", ValidationMessage>>;

type EmptyParams = Record<string, never>;
type EmptyLocals = Record<string, never>;

type ApplyRequestType = Request<
  EmptyParams,
  ApplyRequestValidationErrors,
  ApplyRequestBody,
  ParsedQs,
  EmptyLocals
>;
type ApplyResponseType = Response<ApplyRequestValidationErrors, EmptyLocals>;

type Attachment = Mail.Attachment;

export function applyRequest(req: ApplyRequestType, res: ApplyResponseType): void {
  const validationErrors: ApplyRequestValidationErrors = {};

  const { name, phone, email, comment: rawComment } = req.body;

  const buyerName = isNonEmptyString(name) ? name : null;
  if (buyerName === null) {
    validationErrors.name = {
      message: 'Пожалуйста, заполните поле "Имя"',
    };
  }

  const buyerPhone = isNonEmptyString(phone) ? phone : null;
  if (buyerPhone === null) {
    validationErrors.phone = {
      message: 'Пожалуйста, заполните поле "Телефон"',
    };
  }

  const buyerEmail = isNonEmptyString(email) ? email : null;
  if (buyerEmail === null) {
    validationErrors.email = {
      message: 'Пожалуйста, заполните поле "E-mail"',
    };
  }

  if (buyerName === null || buyerPhone === null || buyerEmail === null) {
    res.status(400).json(validationErrors);

    return;
  }

  const buyerComment =
    typeof rawComment === "string" && rawComment.length > 0 ? rawComment : undefined;

  const attachments: Attachment[] = [];

  if (req.file) {
    attachments.push({
      content: req.file.buffer,
      contentType: req.file.mimetype,
      filename: `Заявка от ${buyerName}.${extractFileExtension(req.file.originalname)}`,
    });
  }

  sendEmail(buyerName, buyerPhone, buyerEmail, buyerComment, attachments)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error: unknown) => {
      console.error(error);
      res.sendStatus(500);
    });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function extractFileExtension(fileName: string): string {
  const dotParts = fileName.split(".");
  const extension = dotParts[dotParts.length - 1];

  return extension;
}

function formatEmailText(name: string, phone: string, email: string, comment?: string): string {
  const emailText: string[] = [];

  emailText.push(`Заявка от ${name}`);
  emailText.push(`Телефон: ${phone}`);
  emailText.push(`E-mail: ${email}`);

  if (comment) {
    emailText.push(`Комментарий к заявке: ${comment}`);
  }

  return emailText.join("\n");
}

function sendEmail(
  name: string,
  phone: string,
  email: string,
  comment: string | undefined,
  attachments: Attachment[],
): Promise<SentMessageInfo> {
  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: true,
    auth: {
      user: mailConfig.username,
      pass: mailConfig.password,
    },
  });

  return transporter.sendMail({
    from: mailConfig.sender,
    to: mailConfig.recipients,
    subject: `Заявка от ${name}`,
    text: formatEmailText(name, phone, email, comment),
    attachments,
  });
}
