const { checkUserPermission } = require('../helpers');
const PortalError = require('./../error');
const {UserService} = require('./../services');

class UserController {
  // @desc    Get users
  // @route   GET /api/user
  // @access  Private
  // @permission  SHOW_ALL_USERS
  async getUsers(req, res, next) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ status: 401, message: 'Token expired!', data: null });
      }

      const userHasPermission = await checkUserPermission('SHOW_ALL_USERS', token);

      if (!userHasPermission) {
        return next(PortalError.Forbidden('Users is not allowed to see all users!'));
      }

      const users = await UserService.getUsers();

      res.status(200).json({ status: 200, message: 'Users were fetched successfully!', data: users });
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  // @desc    Get user
  // @route   GET /api/user/:id
  // @access  Private
  async getUser(req, res, next) {
    try {
      if (!req.params.id) {
        return next(PortalError.BadRequest('id is missing!'));
      }

      const {id, applicationId, firstName, lastName, email, avatar, facebook, linkedIn, instagram} = await UserService.getUser(req.params.id);

      res.status(200).json({ status: 200, message: 'User was fetched successfully!', data: {
        id, applicationId, firstName, lastName, email, facebook, linkedIn, instagram, avatar
      }});
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  // @desc    Update user
  // @route   PUT /api/user/:id
  // @access  Private
  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const { firstName, lastName, email, avatar, facebook, linkedIn, instagram } = req.body;

      if (!userId) {
        return next(PortalError.BadRequest('User ID is missing!'));
      }

      const updatedUser = await UserService.updateUser(userId, { firstName, lastName, email, avatar, facebook, linkedIn, instagram }, req.file);

      // You can choose which fields to send back in the response
      res.status(200).json({ status: 200, message: 'User updated successfully!', data: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        socialMedia: {
          facebook: updatedUser.facebook,
          linkedIn: updatedUser.linkedIn,
          instagram: updatedUser.instagram
        }
      }});
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  // @desc    Delete user
  // @route   DELETE /api/user/:id
  // @access  Private
  async deleteUser(req, res, next) {
    try {
      if (!req.params.id) {
        return next(PortalError.BadRequest('id is missing!'));
      }

      const user = await UserService.deleteUser(req.params.id);

      res.status(200).json({ status: 200, message: 'User was deleted successfully!', data: user});
    } catch (err) {
      return next(PortalError.BadRequest(err.message));
    }
  };

  async checkUser(req, res, next) {
    const {id} = req.query;

    if (!id) {
      return next(PortalError.BadRequest('ID is missing!'));
    }

    res.json(id);
  }
}

module.exports = new UserController();