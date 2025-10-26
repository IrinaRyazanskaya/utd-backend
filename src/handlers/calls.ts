import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";
import type { Request, Response } from "express";
import type { ParsedQs } from "qs";

import { mailConfig } from "../config";

type OrderCallRequestBody = {
  name: unknown;
  phone: unknown;
};

type ValidationMessage = {
  message: string;
};

type OrderCallValidationErrors = Partial<Record<keyof OrderCallRequestBody, ValidationMessage>>;

type EmptyParams = Record<string, never>;
type EmptyLocals = Record<string, never>;

type OrderCallRequest = Request<
  EmptyParams,
  OrderCallValidationErrors,
  OrderCallRequestBody,
  ParsedQs,
  EmptyLocals
>;
type OrderCallResponse = Response<OrderCallValidationErrors, EmptyLocals>;

export function orderCall(req: OrderCallRequest, res: OrderCallResponse): void {
  const validationErrors: OrderCallValidationErrors = {};

  const { name, phone } = req.body;

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

  if (buyerName === null || buyerPhone === null) {
    res.status(400).json(validationErrors);

    return;
  }

  sendEmail(buyerName, buyerPhone)
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

function sendEmail(name: string, phone: string): Promise<SentMessageInfo> {
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
    subject: `Заявка на звонок от ${name}`,
    text: `${name} просит Вас перезвонить по номеру ${phone}`,
  });
}
