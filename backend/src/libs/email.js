import config from '../config';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';




const sendEmail = async  (email, subject, text) => {
    try {
        const oAuth2Client = new google.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECRET);
        oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'grafo.research@gmail.com',
                clientId: config.CLIENT_ID,
                clientSecret: config.CLIENT_SECRET,
                refreshToken: config.REFRESH_TOKEN,
                accessToken
            }
        });
        const mailOptions = {
            from: 'Grafo Research Support <grafo.research@gmail.com>',
            to: email,
            subject,
            text
        };
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error
    }
}

export const emailWelcome = async (email, name) => {
    const subject = "Welcome to Grafo Research"
    const text = `Hello ${name},\nWelcome to Grafo Research\nYour email is: ${email}`
    await sendEmail(email, subject, text);
}

export const emailAccepted = async (email, name) => {
    const subject = "Grafo Research | Your request has been accepted"
    const text = `Hello ${name},\nYour request has been accepted.`
    await sendEmail(email, subject, text);
}

export const emailRejected = async (email, name) => {
    const subject = "Grafo Research | Your request has been rejected"
    const text = `Hello ${name},\nYour request has been rejected`
    await sendEmail(email, subject, text);
}
