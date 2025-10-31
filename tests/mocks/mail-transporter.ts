import type { Transporter, SendMailOptions } from "nodemailer";

type MailTransporterMock = {
  mailTransporter: Transporter;
  sendMailCalls: SendMailOptions[];
  setSendMailError: (error: unknown) => void;
};

function createMailTransporterMock(): MailTransporterMock {
  const sendMailCalls: SendMailOptions[] = [];
  let nextError: unknown = null;

  async function sendMail(options: SendMailOptions): Promise<void> {
    sendMailCalls.push(options);

    if (nextError !== null) {
      const error = nextError;
      nextError = null;

      throw error;
    }
  }

  return {
    mailTransporter: {
      sendMail,
    } as unknown as Transporter,
    sendMailCalls,
    setSendMailError(error: unknown) {
      nextError = error;
    },
  };
}

export { createMailTransporterMock };
