import request from "supertest";
import nodemailer from "nodemailer";
import { describe, expect, it } from "vitest";

import { createApplication } from "../src/application.js";

describe("GET /api/ping", () => {
  const application = createApplication({
    authToken: "test-token",
    mailTransporter: nodemailer.createTransport({ jsonTransport: true }),
  });

  it("responds with 200 status and OK body", async () => {
    const response = await request(application).get("/api/ping");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/plain/);
    expect(response.text).toBe("OK");
  });
});
