const express = require('express');
const AuthController = require('./../controllers/auth-controller');
const router = express.Router();

router.route('/').get(AuthController.check);
router.route('/confirm/:confirmationCode').post(AuthController.verifyUser);
router.route('/reset-password').post(AuthController.requestResetPassword);
// router.route('/reset-password/:userId/:token').post(AuthController.resetPassword);
router.route('/sign-in').post(AuthController.signIn);
router.route('/sign-up').post(AuthController.signUp);
router.route('/sign-out').post(AuthController.signOut);

module.exports = router;