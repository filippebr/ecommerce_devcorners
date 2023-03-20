const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const { host, port, user, pass } = require('../config/mail.json');

const sendEmail = asyncHandler(async(data, req, res) => {
  let transporter = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

  // send mail with defined transport object
  transporter.sendMail({
    from: `"Hey 👻" <abc@gmail.com>`, // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.htm, // html body
  }, (err) => {
    if (err) 
      return res.status(400).send({error: 'Cannot send forgot password email'});
    return res.send();
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
})

module.exports = sendEmail;