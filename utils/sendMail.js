'use strict';
/**
 * Module dependencies
 */
//=============================================================================
const
  nodemailer = require('nodemailer'),
  // sgTransport = require('nodemailer-sendgrid-transport');
  sgTransport = require('nodemailer-smtp-transport');
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
const
  // sgtOptions = {

  //   auth: {
  //     api_key: '',
  //   }
  // },
  sgtOptions = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: '',
      pass: ''
    }
  },
  mailer = nodemailer.createTransport(sgTransport(sgtOptions));

//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = function (details, topic) {
  const msg = {
    to: '',
    from: 'report@botservice.com',
    subject: topic,
    html: `<div><p>Hello Ajor,</p><p>${topic}</p>
           <br><ul><b>${details}</b></ul>
          <p>Have a splendid day</p>
    </div>`
  };
  //send email
  mailer.sendMail(msg, function (err, res) {
    if (err) {
      return console.error(err);
    }
    return console.log(res);
  });
};
//=============================================================================