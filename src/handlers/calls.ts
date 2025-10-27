import type { Transporter } from "nodemailer";
import type { Request, Response } from "express";

import { isNonEmptyString } from "../utils/strings.js";

type OrderCallOptions = {
  mailTransporter: Transporter;
};

type OrderCallRequestBody = {
  name: unknown;
  phone: unknown;
};

type OrderCallValidationErrors = {
  name?: {
    message: string;
  };
  phone?: {
    message: string;
  };
};

function createOrderCallHandler({ mailTransporter }: OrderCallOptions) {
  return async function orderCall(request: Request, response: Response): Promise<void> {
    const { name, phone } = request.body as OrderCallRequestBody;

    const validationErrors: OrderCallValidationErrors = {};

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
      response.status(400).json(validationErrors);

      return;
    }

    try {
      await mailTransporter.sendMail({
        subject: `Заявка на звонок от ${buyerName}`,
        text: `${buyerName} просит Вас перезвонить по номеру ${buyerPhone}`,
      });

      response.sendStatus(200);
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
    }
  };
}

export { createOrderCallHandler };
export type { OrderCallOptions };
