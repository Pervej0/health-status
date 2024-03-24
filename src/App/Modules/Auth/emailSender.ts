import nodemailer from "nodemailer";
import config from "../../config";

const emailSender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.EMAIL,
    pass: config.PASSWORD,
  },
});

export default emailSender;
