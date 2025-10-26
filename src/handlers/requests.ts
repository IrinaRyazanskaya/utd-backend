import type { Request, Response } from "express";

import { sendMail } from "../utils/emails";
import type { Attachment } from "../utils/emails";
import { extractFileExtension } from "../utils/files";
import { isNonEmptyString } from "../utils/strings";

type ApplyRequestBody = {
  name: unknown;
  phone: unknown;
  email: unknown;
  comment?: unknown;
};

type ApplyRequestValidationErrors = {
  name?: {
    message: string;
  };
  phone?: {
    message: string;
  };
  email?: {
    message: string;
  };
};

async function applyRequest(request: Request, response: Response): Promise<void> {
  const { name, phone, email, comment: rawComment } = request.body as ApplyRequestBody;

  const validationErrors: ApplyRequestValidationErrors = {};

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
    response.status(400).json(validationErrors);

    return;
  }

  const buyerComment = isNonEmptyString(rawComment) ? rawComment : undefined;

  const attachments: Attachment[] = request.file
    ? [
        {
          content: request.file.buffer,
          contentType: request.file.mimetype,
          filename: `Заявка от ${buyerName}.${extractFileExtension(request.file.originalname)}`,
        },
      ]
    : [];

  try {
    await sendMail({
      subject: `Заявка от ${buyerName}`,
      text: formatEmailText(buyerName, buyerPhone, buyerEmail, buyerComment),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    response.sendStatus(200);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
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

export { applyRequest };
