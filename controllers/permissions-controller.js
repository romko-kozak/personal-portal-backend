const PortalError = require('./../error');
const {PermissionsService} = require('./../services');
const {validate} = require('./../helpers');

class PermissionsController {
  // @desc    Get users
  // @route   GET /api/permissions
  // @access  Private
  async getPermissions(req, res, next) {
    try {
      const permissions = await PermissionsService.getPermissions();

      res.status(200).json({ status: 200, message: 'Permissions were fetched successfully!', data: permissions });
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  // @desc    Get user permissions
  // @route   GET /api/permissions/:userId
  // @access  Private
  async getUserPermissions(req, res, next) {
    try {
      if (!req.params.userId) {
        return next(PortalError.BadRequest('User id is missing!'));
      }

      const permissions = await PermissionsService.getUserPermissions(req.params.userId);

      res.status(200).json({ status: 200, message: 'Permissions were fetched successfully!', data: permissions });
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  // @desc    Assign permission to user
  // @route   POST /api/permissions/:userId
  // @access  Private
  async assignPermissionToUser(req, res, next) {
    try {
      if (!req.params.userId) {
        return next(PortalError.BadRequest('User id is missing!'));
      }

      const permission = await PermissionsService.assignPermissionToUser(req.params.userId, req.body.id, req.body.assign);

      res.status(200).json({ status: 200, message: `User permission was ${req.body.assign ? 'assigned' : 'removed'} successfully!`, data: permission });
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  // @desc    Create permission
  // @route   POST /api/permissions
  // @access  Private
  async createPermission(req, res, next) {
    try {
      const requiredFields = ['name', 'description'];
      const {valid, errors} = validate(requiredFields, req);

      if (valid) {
        const permission = await PermissionsService.createPermission(req.body.name, req.body.description);

        res.status(200).json({ status: 200, message: 'Permission was created successfully!', data: permission });
      } else {
        next(PortalError.BadRequest(errors));
      }
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  // @desc    Delete permission
  // @route   DELETE /api/permissions/:id
  // @access  Private
  async deletePermission(req, res, next) {
    try {
      if (!req.params.id) {
        return next(PortalError.BadRequest('id is missing!'));
      }

      const permission = await PermissionsService.deletePermission(req.params.id);

      res.status(200).json({ status: 200, message: 'Permission was deleted successfully!', data: permission});
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };
}

module.exports = new PermissionsController();