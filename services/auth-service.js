const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const {sendEmail} = require('./../config/mailer');
const {generateEmailTemplate} = require('./../mail-template');

class AuthService {
  async generateToken(id, email, remember) {
    const expiresIn = remember ? '10d' : '24h';
  
    return await jwt.sign({id, email}, process.env.JWT_SECRET_KEY, {expiresIn});
  }

  async signUp(requestBody) {
    try {
      const { applicationId, secret, email, firstName, lastName } = requestBody;
      const hashedSecret = await bcrypt.hash(secret, 15); // To compare use method compare(secret, hashedSecret)
      const candidate = await User.findOne({ where: { email }});

      if (candidate) {
        throw ({message: 'User already exists!'});
      }

      const confirmationCode = await jwt.sign({email, applicationId, firstName, lastName}, process.env.CONFIRMATION_KEY_SECRET);

      const user = await User.create({
        applicationId, email, firstName, lastName,
        confirmationCode, secret: hashedSecret
      });
      const token = await this.generateToken(user.id, email, false);
      const confirmationEmail = generateEmailTemplate(user);

      await sendEmail("Please confirm your account", user.email, confirmationEmail);

      return token;
    } catch (err) {
      const candidate = await User.findOne({ where: { email: requestBody.email }});

      if (candidate) {
        await User.destroy({ where: { id: candidate.id }});
      }

      throw new Error(err.message);
    }
  }

  async signIn(requestBody) {
    try {
      const {email, secret, remember = false} = requestBody;
      const user = await User.findOne({where: {email}});

      if (!user) {
        throw ({message: 'User does not exist!'});
      }
      
      if (user.status === 'Denied') {
        throw ({message: 'Sorry, you are not allowed to access this app!'});
      }

      if (user.status !== 'Verified') {
        throw ({message: 'Please verify Your email!'});
      }

      let compareSecret = bcrypt.compareSync(secret, user.secret);

      if (!compareSecret) {
        throw ({message: 'Wrong credentials!'});
      }

      const token = await this.generateToken(user.id, email, remember);

      return token
    } catch (err) {
      throw err;
    }
  }

  async verifyUser(req) {
    try {
      const user = await User.findOne({where: {confirmationCode: req.params.confirmationCode}});

      if (!user) {
        throw ({message: 'User does not exist!'});
      }

      if (user.status === 'Verified') {
        throw ({message: 'This user is already verified! Please sign in.'});
      }

      await User.update({status: 'Verified'}, {where: {confirmationCode: req.params.confirmationCode}});

      return user;
    } catch (err) {
      throw err;
    }
  }

  async requestResetPassword(email) {
    try {
      const user = await User.findOne({ where: { email }});

      if (!user) {
        throw ({message: 'User with this email does not exist!'});
      }

      const token = await this.generateToken(user.id, email, false);
      const resetPasswordEmail = `<h1>Reset Password</h1>
        <h2>Hello ${user.firstName} ${user.lastName}</h2>
        <p>Please reset your password by clicking on the following link</p>
        <a href=http://${process.env.CLIENT_APP_LOGIN_PATH}/password-reset/${user.id}/${token}>Reset Password</a>
        </div>`;

      await sendEmail(user.email, "Password reset", resetPasswordEmail);

      return token;
    } catch (err) {
      
    }
  }
}

module.exports = new AuthService();