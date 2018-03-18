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
      api_user: 'apikey',
      api_key: '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',
      email: 'ernest.offiong@gmail.com'
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
    to: email,
    from: 'report@botservice.com',
    subject: report,
    html: `<div><p>Hello ${email},</p><p>${report}</p>
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
