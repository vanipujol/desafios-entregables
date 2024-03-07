import nodemailer from "nodemailer";
import {options} from "./config.js";

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

export { transport };