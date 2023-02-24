import dotenv from "./dotenv";
dotenv.config();
const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD_GMAIL,
    },
    tls: {
        rejectUnauthorized: false,
    }
})
