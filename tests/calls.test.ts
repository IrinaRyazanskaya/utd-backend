import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { createApplication } from "../src/application.js";
import { createMailTransporterMock } from "./mocks/mail-transporter.js";

describe("POST /api/calls", () => {
  const authToken = "test-token";

  let mailTransporterMock = createMailTransporterMock();
  let application = createApplication({
    authToken,
    mailTransporter: mailTransporterMock.mailTransporter,
  });

  beforeEach(() => {
    mailTransporterMock = createMailTransporterMock();
    application = createApplication({
      authToken,
      mailTransporter: mailTransporterMock.mailTransporter,
    });
  });

  it("responds with 200 and sends mail when payload is valid", async () => {
    const response = await request(application)
      .post("/api/calls")
      .set("x-auth-token", authToken)
      .send({
        name: "Ivan",
        phone: "+79990000000",
      });

    expect(response.status).toBe(200);
    expect(mailTransporterMock.sendMailCalls).toHaveLength(1);

    const [mailOptions] = mailTransporterMock.sendMailCalls;
    expect(mailOptions.subject).toBe("Заявка на звонок от Ivan");
    expect(mailOptions.text).toBe("Ivan просит Вас перезвонить по номеру +79990000000");
  });

  it("responds with 400 and validation errors when payload is invalid", async () => {
    const response = await request(application)
      .post("/api/calls")
      .set("x-auth-token", authToken)
      .send({
        name: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      name: {
        message: 'Пожалуйста, заполните поле "Имя"',
      },
      phone: {
        message: 'Пожалуйста, заполните поле "Телефон"',
      },
    });
    expect(mailTransporterMock.sendMailCalls).toHaveLength(0);
  });

  it("responds with 500 when mail sending fails", async () => {
    mailTransporterMock.setSendMailError(new Error("Mail is not available"));

    const response = await request(application)
      .post("/api/calls")
      .set("x-auth-token", authToken)
      .send({
        name: "Ivan",
        phone: "+79990000000",
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Mail is not available",
    });
    expect(mailTransporterMock.sendMailCalls).toHaveLength(1);
  });
});
