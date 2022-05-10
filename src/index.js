const express = require("express");
const cors = require("cors");
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

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.post("/send", (req, res) => {
  const body = req.body;
  runEmail(body);
  res.status(200);
  res.send({ status: "sucess" });
});

app.listen(3333, () => {
  console.log("Servidor Online");
});
