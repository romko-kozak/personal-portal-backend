const express = require('express');
const multer = require('multer');
const UserController = require('./../controllers/user-controller');
const AuthController = require('./../controllers/auth-controller');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.route('/').get(UserController.getUsers).post(AuthController.signUp);
router.route('/:id').get(UserController.getUser).delete(UserController.deleteUser);
router.put('/:id', upload.single('avatar'), UserController.updateUser);

module.exports = router;