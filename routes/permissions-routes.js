const express = require('express');
const PermissionsController = require('./../controllers/permissions-controller');
const router = express.Router();

router.route('/').get(PermissionsController.getPermissions).post(PermissionsController.createPermission);
router.route('/:id').delete(PermissionsController.deletePermission);
router.route('/:userId').get(PermissionsController.getUserPermissions).post(PermissionsController.assignPermissionToUser);

module.exports = router;