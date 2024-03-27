import nodemailer from "nodemailer";
import {options} from "./config.js";
import {emailSender} from "../utils.js";

const adminEmail = options.EMAIL;
const adminPass = options.PASS;

const transport = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user:adminEmail,
        pass:adminPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
})

export const sendPasswordRecovery = async (email, token) => {

    const link = `http://localhost:8080/resetPassword?token=${token}`;

    const template = `
    <div>
        <h1>Solicitud cambio de contraseña</h1>
        <p>Para restablecer tu contraseña has click aquí</p>
        <a href="${link}">Restablecer contraseña</a>
    </div>
    `

    const subject = "Restablecer contraseña";
    return await emailSender(email, template, subject);
}

export { transport };