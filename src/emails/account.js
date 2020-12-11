const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yagarwal1307@gmail.com',
    subject: 'Thanks for joining in',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yagarwal1307@gmail.com',
    subject: 'Goodbye dear User!',
    text: `Dear ${name}, We are sad you are leaving our family. Is there somethig we could have done to keep you on board? Please leave the feedback on the link below!`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}