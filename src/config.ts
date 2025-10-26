const serverConfig = {
  port: 3000,
} as const;

const mailConfig = {
  host: "smtp.yandex.ru",
  port: 465,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  sender: '"УралТехДеталь Бот" <utd-bot@yandex.ru>',
  recipients: process.env.MAIL_RECIPIENTS,
} as const;

export { serverConfig, mailConfig };
