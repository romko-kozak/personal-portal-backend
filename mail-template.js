const generateEmailTemplate = (user) => `<!DOCTYPE html>
  <html>
    <head>
      <meta />
      <meta content="width=device-width, initial-scale=1.0" />
      <title>Email Confirmation</title>
      <style>
        body {
          font-family: 'Roboto', Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #ffffff;
          background: #fff;
        }

        .main-wrapper {
          padding: 120px 0;
          background: #fff;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 50px 0;
          overflow: hidden;
          background-color: #fff;
        }

        .letter-wrapper {
          border: 1px solid #ddd;
          border-radius: 16px;
          max-width: 600px;
          margin: 0 auto;
          overflow: hidden;
          box-shadow: 0px 29px 35px -9px rgba(0,0,0,0.27);
        }

        .header {
          padding: 20px;
          box-sizing: border-box;
          text-align: center;
          color: #fff;
          max-width: 600px;
          margin: 0 auto;
          background: url('https://img.freepik.com/free-vector/gradient-liquid-abstract-background_23-2148925549.jpg');
        }

        .header h1 {
          margin: 0;
        }

        .content {
          line-height: 1.6;
          color: #2C2D37;
          width: 90%;
          margin: 0 auto;
          border-radius: 16px;
          font-size: 16px;
          text-align: left;
        }

        .content a {
          text-decoration: none;
        }

        .icon-container {
          text-align: center;
          display: flex;
          justify-content: center;
        }

        .header-icon {
          width: 80%;
          margin: 0 auto;
        }

        .title {
          font-size: 24px;
          font-weight: 800;
          margin: 16px auto 56px;
          text-align: center;
          color: #5f0471;
        }

        .btn-confirm {
          padding: 16px;
          max-width: 350px;
          border-radius: 32px;
          font-size: 16px;
          font-weight: 300;
          background: #fa4305;
          border: none;
          color: #f9f9f9;
          text-decoration: none;
          text-align: center;
          margin: 32px auto;
        }

        .lower-text {
          text-align: center;
        }
        
        .lower-text a {
          text-decoration: underline;
        }
        
        strong {
          color: #5f0471;
        }
        
        strong a {
          color: #5f0471;
        }

        .footer {
          max-width: 600px;
          padding: 10px 20px;
          box-sizing: border-box;
          margin: 0 auto;
          text-align: center;
          font-size: 12px;
          color: #fff;
          background: url('https://img.freepik.com/free-vector/gradient-liquid-abstract-background_23-2148925549.jpg');
        }
      </style>
    </head>
    <div class="main-wrapper">
      <div class="letter-wrapper">
        <div class="header">
          <h1>RK | Portal</h1>
        </div>
        <div class="container">
          <div class="content">
            <div class="icon-container">
              <img class="header-icon" src="https://www.sender.net/wp-content/uploads/2022/02/Email-Campaigns-smaller.png" alt="email-icon" />
            </div>
            <h1 class="title">Please confirm your email address</h1>
            <p><strong>Hello ${user.firstName} ${user.lastName},</strong></p>
            <p>Thank you for signing up. We're thrilled to have you on board. To get started with our portal, please confirm your email address by clicking the button below:</p>
            <a href="http://${process.env.CLIENT_APP_LOGIN_PATH}?confirmationCode=${user.confirmationCode}">
              <div class="btn-confirm">Confirm Your Email</div>
            </a>
            <p class="lower-text">Didn't sign up for our Portal? <strong><a href="mailto:[Your Support Email]">Let us know</a></strong></p>
          </div>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to <a href="mailto:[Your Support Email]" style="color: #fff;">contact us</a>.</p>
          <p>© ${new Date().getFullYear()} RK | Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  </html>
`;

module.exports = {generateEmailTemplate};