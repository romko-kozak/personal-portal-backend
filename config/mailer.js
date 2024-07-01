const nodemailer = require("nodemailer");

const user = process.env.MAILER_USER_EMAIL;
const pass = process.env.MAILER_USER_PASS;

const useTestMailer = async () => {
  const testAccount = await nodemailer.createTestAccount();
  const testTransporter = nodemailer.createTransport({
    service: 'hotmail',
    host: 'smtp.office365.com',
    port: 587,
    auth: {user, pass},
    logger: true,
    secureConnection: true,
    transactionLog: true, // include SMTP traffic in the logs
    allowInternalNetworkInterfaces: false
  }, {from: `RK | Customer Portal <${user}>`, sender: user});

  return [testAccount, testTransporter];
}

const sendEmail = async (subject, receiverEmail, message) => {
  try {
    const [testAccount, testTransporter] = await useTestMailer();

    console.log("Check");

    await testTransporter.sendMail({to: receiverEmail, subject, html: message}, (err, info) => {
      if (err) {
        return process.exit(1);
      }
      // only needed when using pooled connections
      testTransporter.close();
    });
  } catch (err) {
    throw({message: 'Email was not sent due to the problem during the process!', stack: err.stack})
  }
};

module.exports = {
  sendEmail
}