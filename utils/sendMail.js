'use strict';
/**
 * Module dependencies
 */
//=============================================================================
const
  // os = require('os'),
  nodemailer = require('nodemailer'),
  sgTransport = require('nodemailer-sendgrid-transport'),
  _ = require('lodash');
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
const
  sgtOptions = {
    auth: {
      api_user: process.env.SendGridUsername,
      api_key: process.env.SendGridPassword,
    }
  },
  mailer = nodemailer.createTransport(sgTransport(sgtOptions));
//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = (json, report)=> {
  
  const msgDisp = () => {
    _.forEach(json, (value, key) => {
      `<li>${key} - ${value}</li>`
    });
  };

  const msg = {
    to: process.env.Email,
    from: 'report@botservice.com',
    subject: report,
    html: `<div><p>Hello ${process.env.Email},</p><p>${report}</p>
            View the data below <br><ul>${msgDisp()}</ul>
 
    </div>`
  };
  //send email
  mailer.sendMail(msg, (err, res) => {
    if (err) {
      return console.error(err);
    }
    return console.log(res);
  });
};
//=============================================================================
