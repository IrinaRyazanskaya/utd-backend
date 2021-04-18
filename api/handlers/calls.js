const nodemailer = require('nodemailer');

function orderCall(req, res) {
    const buyerName = req.body.name;
    const buyerPhone = req.body.phone;

    const validationErrors = {};

    if (!(typeof buyerName === 'string' && buyerName.length > 0)) {
        validationErrors.name = {
            message: 'Пожалуйста, заполните поле "Имя"',
        };
    }

    if (!(typeof buyerPhone === 'string' && buyerPhone.length > 0)) {
        validationErrors.phone = {
            message: 'Пожалуйста, заполните поле "Телефон"',
        };
    }

    if (Object.keys(validationErrors).length > 0) {
        res.status(400).json(validationErrors);

        return;
    }

    sendEmail(buyerName, buyerPhone)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.error(error);
            res.sendStatus(500);
        });
}

function sendEmail(name, phone) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    return transporter.sendMail({
        from: '"УралТехДеталь Бот" <utd-bot@yandex.ru>',
        to: process.env.MAIL_RECIPIENTS,
        subject: `Заявка на звонок от ${name}`,
        text: `${name} просит Вас перезвонить по номеру ${phone}`,
    });
}

module.exports = { orderCall };
