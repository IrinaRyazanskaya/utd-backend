const apiConfig = {
  token: process.env.API_TOKEN || "utd-dummy-token",
} as const;

const mailConfig = {
  host: process.env.MAIL_HOST || "smtp.yandex.ru",
  port: Number(process.env.MAIL_PORT) || 465,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  sender: process.env.MAIL_SENDER || '"УралТехДеталь Бот" <utd-bot@yandex.ru>',
  recipients: process.env.MAIL_RECIPIENTS,
} as const;

const serverConfig = {
  port: Number(process.env.SERVER_PORT) || 3000,
} as const;

export { apiConfig, mailConfig, serverConfig };
