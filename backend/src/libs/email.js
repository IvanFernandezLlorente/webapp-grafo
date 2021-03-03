import config from '../config';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';




const sendEmail = async  (email, subject, text, html = '') => {
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
            text,
            html
        };
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error
    }
}

export const emailWelcome = async (user) => {
    const subject = "Welcome to Grafo Research"
    const text = `Hello ${user.name},\nWelcome to Grafo Research\nYour email is: ${user.email}`
    await sendEmail(user.email, subject, text);
}

export const emailAccepted = async (application) => {
    const subject = "Grafo Research | Your request has been accepted"
    const text = `Hello ${application.name},\nYour request has been accepted.`
    const html =`<p>Hello ${application.name}</p><p>Your request has been accepted</p><a href="http://localhost:8080/register/${application._id}/${application.token}">Click here</a>`
    await sendEmail(application.email, subject, text, html);
}

export const emailRejected = async (application) => {
    const subject = "Grafo Research | Your request has been rejected"
    const text = `Hello ${application.name},\nYour request has been rejected`
    await sendEmail(application.email, subject, text);
}
