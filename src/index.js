const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const SMTP_CONFIG = require("./config/smtp");

const transporter = nodemailer.createTransport({
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  secure: false,
  auth: {
    user: SMTP_CONFIG.user,
    pass: SMTP_CONFIG.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function runEmail(body) {
  const mailSent = await transporter.sendMail({
    subject: body.subject,
    from: body.from,
    to: body.to,
    html: body.hmtlContent,
  });

}

const app = express();

app.use(bodyParser.json());

app.post("/send", (req, res) => {
  const body = req.body;
  runEmail(body);
  res.status(200);
  res.send({ "status": "sucess" });
});

app.listen(3333, () => {
  console.log("Servidor Online");
});
