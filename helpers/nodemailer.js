const nodemailer = require('nodemailer');
require('dotenv').config();

function sendContactMail (mail, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ementhboxmanager@gmail.com',
      pass: process.env.MAILPASS
    }
  });

  const mailOptions = {
    from: 'ementhboxmanager@gmail.com',
    to: mail,
    subject: `Hey! Let's start train!`,
    text: '',
    html: `
      <p>Hi!</p>
      <p>You are invited to our Box! Click there for get full acces:</p>
      <p><a href="${process.env.MAILURL}/${token}/${mail}"></a></p>
      <p>You are invited to our Box! Click there for get full acces:</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  sendContactMail
};