const moment = require('moment');
const jwt = require('jsonwebtoken');
const PortalError = require('./../error');
const {validate} = require('./../helpers');
const {AuthService} = require('./../services');

class AuthController {
  // @desc    Create user
  // @route   POST /api/auth/sign-up
  // @access  Public
  async signUp(req, res, next) {
    try {
      const requiredFields = ['applicationId', 'secret', 'email', 'firstName', 'lastName'];
      const {valid, errors} = validate(requiredFields, req);

      if (valid) {
        const token = await AuthService.signUp(req.body);

        res.status(200).json({ status: 200, message: 'User was created successfully!'});
      } else {
        next(PortalError.BadRequest(errors));
      }
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  // @desc    Sign in
  // @route   POST /api/auth/sign-in
  // @access  Public
  async signIn(req, res, next) {
    try {
      const requiredFields = ['email', 'secret'];
      const {valid, errors} = validate(requiredFields, req);

      if (valid) {
        const token = await AuthService.signIn(req.body);

        res.cookie('token', token, {
          expires: moment().add(req.body.remember ? 10 : 1, 'd').toDate(),
          maxAge: moment.duration(req.body.remember ? 10 : 1, 'd').asMilliseconds(),
          secure: process.env.NODE_ENV === "production",
          httpOnly: true
        });
        res.status(200).json({ status: 200, message: 'User signed in successfully!', data: token});
      } else {
        return next(PortalError.BadRequest(errors));
      }
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  }

  // @desc    Sign out
  // @route   POST /api/auth/sign-out
  // @access  Private
  async signOut(req, res, next) {
    try {
      await res.clearCookie('token');
      res.status(200).json({ status: 200, message: 'User signed out successfully!' });
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  }

  // @desc    Check auth status
  // @route   GET /api/auth
  // @access  Public
  async check(req, res, next) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ status: 401, message: 'Token expired!', data: null });
      }

      const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY, {algorithms: ["HS256"]});

      res.status(200).json({ status: 200, message: 'User authorized!', data: verifiedToken });
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  }

  // @desc    Verify User
  // @route   GET /api/auth/confirm/:confirmationCode
  // @access  Public
  async verifyUser(req, res, next) {
    try {
      const user = await AuthService.verifyUser(req, next);
      res.status(200).json({status: 200, message: 'User verified! Please sign in.', data: user});      
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  }

  // @desc    Request to reset password
  // @route   POST /api/auth/reset-password
  // @access  Public
  async requestResetPassword(req, res, next) {
    try {
      const {valid, errors} = validate(['email'], req);

      if (valid) {
        await AuthService.requestResetPassword(req.body.email);

        res.status(200).json({status: 200, message: 'Reset password link was sent to your email.'});
      } else {
        next(PortalError.BadRequest(errors));
      }
    } catch (error) {
      return next(PortalError.BadRequest(err.message));
    }
  }
}

module.exports = new AuthController();