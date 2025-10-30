import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { createApplication } from "../src/application.js";
import { createMailTransporterMock } from "./mocks/mail-transporter.js";

describe("POST /api/requests", () => {
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
      .post("/api/requests")
      .set("x-auth-token", authToken)
      .field("name", "Ivan")
      .field("phone", "+79990000000")
      .field("email", "ivan@example.com");

    expect(response.status).toBe(200);
    expect(mailTransporterMock.sendMailCalls).toHaveLength(1);

    const [mailOptions] = mailTransporterMock.sendMailCalls;
    expect(mailOptions.subject).toBe("Заявка от Ivan");
    expect(mailOptions.text).toBe(
      ["Заявка от Ivan", "Телефон: +79990000000", "E-mail: ivan@example.com"].join("\n"),
    );
    expect(mailOptions.attachments).toBeUndefined();
  });

  it("attaches uploaded file and comment to the email", async () => {
    const fileContent = Buffer.from("test order content");

    const response = await request(application)
      .post("/api/requests")
      .set("x-auth-token", authToken)
      .field("name", "Anna")
      .field("phone", "+79990000001")
      .field("email", "anna@example.com")
      .field("comment", "Please call in the evening")
      .attach("order", fileContent, { filename: "order.pdf", contentType: "application/pdf" });

    expect(response.status).toBe(200);
    expect(mailTransporterMock.sendMailCalls).toHaveLength(1);

    const [mailOptions] = mailTransporterMock.sendMailCalls;
    expect(mailOptions.subject).toBe("Заявка от Anna");
    expect(mailOptions.text).toBe(
      [
        "Заявка от Anna",
        "Телефон: +79990000001",
        "E-mail: anna@example.com",
        "Комментарий к заявке: Please call in the evening",
      ].join("\n"),
    );
    expect(mailOptions.attachments).toHaveLength(1);

    const attachment = mailOptions.attachments?.[0];
    expect(attachment).toBeDefined();

    expect(attachment?.filename).toBe("Заявка от Anna.pdf");

    const attachmentContent = attachment?.content;
    expect(Buffer.isBuffer(attachmentContent)).toBe(true);
    expect((attachmentContent as Buffer).toString()).toBe(fileContent.toString());

    expect(attachment?.contentType).toBe("application/pdf");
  });

  it("responds with 400 and validation errors when payload is invalid", async () => {
    const response = await request(application)
      .post("/api/requests")
      .set("x-auth-token", authToken)
      .field("name", "")
      .field("phone", "")
      .field("email", "");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      name: {
        message: 'Пожалуйста, заполните поле "Имя"',
      },
      phone: {
        message: 'Пожалуйста, заполните поле "Телефон"',
      },
      email: {
        message: 'Пожалуйста, заполните поле "E-mail"',
      },
    });
    expect(mailTransporterMock.sendMailCalls).toHaveLength(0);
  });

  it("responds with 500 when mail sending fails", async () => {
    mailTransporterMock.setSendMailError(new Error("Mail service unavailable"));

    const response = await request(application)
      .post("/api/requests")
      .set("x-auth-token", authToken)
      .field("name", "Ivan")
      .field("phone", "+79990000000")
      .field("email", "ivan@example.com");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Mail service unavailable",
    });
    expect(mailTransporterMock.sendMailCalls).toHaveLength(1);
  });
});
