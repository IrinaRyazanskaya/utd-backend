const nodemailer = require('nodemailer');

function applyRequest(req, res) {
    const buyerName = req.body.name;
    const buyerPhone = req.body.phone;
    const buyerEmail = req.body.email;
    const comment = req.body.comment;
    const attachments = [];

    if (req.file) {
        attachments.push({
            content: req.file.buffer,
            contentType: req.file.mimetype,
            filename: `Заявка от ${buyerName}.${extractFileExtension(req.file.originalname)}`
        });
    }

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

    if (!(typeof buyerEmail === 'string' && buyerEmail.length > 0)) {
        validationErrors.email = {
            message: 'Пожалуйста, заполните поле "E-mail"',
        };
    }

    if (Object.keys(validationErrors).length > 0) {
        res.status(400).json(validationErrors);

        return;
    }

    sendEmail(buyerName, buyerPhone, buyerEmail, comment, attachments)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.error(error);
            res.sendStatus(500);
        });
}

function extractFileExtension(fileName) {
    const dotParts = fileName.split('.');
    const extension = dotParts[dotParts.length - 1];

    return extension;
}

function formatEmailText(name, phone, email, comment) {
    let emailText = [];

    emailText.push(`Заявка от ${name}`);
    emailText.push(`Телефон: ${phone}`);
    emailText.push(`E-mail: ${email}`);

    if (comment) {
        emailText.push(`Комментарий к заявке: ${comment}`);
    }

    return emailText.join('\n');
}

function sendEmail(name, phone, email, comment, attachments) {
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
        subject: `Заявка от ${name}`,
        text: formatEmailText(name, phone, email, comment),
        attachments,
    });
}

module.exports = { applyRequest };
