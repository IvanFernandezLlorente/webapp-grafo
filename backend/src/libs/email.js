import config from '../config';
import nodemailer from 'nodemailer';

const sendEmail = async  (email, subject, text, html = '') => {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user : config.GMAIL_USER,
                pass : config.GMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'Heuristicas Research Support <heuristicas.research@gmail.com>',
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
    const subject = "Welcome to Heuristicas Research"
    const text = `Hello ${user.name},\nWelcome to Heuristicas Research\nYour email is: ${user.email}`
    await sendEmail(user.email, subject, text);
}

export const emailAccepted = async (application) => {
    const subject = "Heuristicas Research | Your request has been accepted"
    const text = `Hello ${application.name},\nYour request has been accepted.` // TODO: change it to dev start  https://localhost:8080
    const html =`<p>Hello ${application.name}</p><p>Your request has been accepted</p><a href="https://nuevawebgrafo.numa.host/register/${application._id}/${application.token}">Click here</a>`
    await sendEmail(application.email, subject, text, html);
}

export const emailRejected = async (application) => {
    const subject = "Heuristicas Research | Your request has been rejected"
    const text = `Hello ${application.name},\nYour request has been rejected`
    await sendEmail(application.email, subject, text);
}

export const emailBan = async (user) => {
    const subject = "Heuristicas Research | Your account has been banned"
    const text = `Hello ${user.name},\nYour account has been banned\nContact for helping at heuristicas.research@gmail.com`
    await sendEmail(user.email, subject, text);
}
