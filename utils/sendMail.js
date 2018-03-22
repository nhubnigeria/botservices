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
  //     api_user: 'nanipaul',
  //     api_pass: 'p@55w0rd!'
  //   }
  // },
  // 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
  sgtOptions = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'ajorvictor48@gmail.com',
      pass: 'catv.345'
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
    to: 'vixxjy@gmail.com',
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