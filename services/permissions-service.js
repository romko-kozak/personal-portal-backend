const {Permissions, UserPermissions, User} = require('../models');

class PermissionsService {
  async getPermissions() {
    try {
      const permissions = await Permissions.findAll();

      return permissions;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUserPermissions(userId) {
    try {
      const userPermissions = await User.findOne({where: {id: userId}, include: Permissions});

      if (!userPermissions.permissions) {
        throw ({message: 'User does not have permissions!'});
      }

      return userPermissions.permissions.map(({name}) => name);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async assignPermissionToUser(userId, permissionId, assign) {
    try {
      // First, check if the user and permission exist
      const userExists = await User.findByPk(userId);
      const permissionExists = await Permissions.findByPk(permissionId);
  
      if (!userExists || !permissionExists) {
        throw new Error('User or Permission not found');
      }

      if (assign) {
        return await UserPermissions.create({
          userId: userId,
          permissionId: permissionId
        });
      }

      return await UserPermissions.destroy({where: {userId, permissionId}});
    } catch (err) {
      console.error('Error assigning permission to user:', err);
    }
  }

  async createPermission(name, description) {
    try {
      const permission = await Permissions.findOne({ where: { name }});

      if (permission) {
        throw ({message: 'Permission already exists!'});
      }

      const newPermission = await Permissions.create({
        name, description
      });

      return newPermission;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deletePermission(id) {
    try {
      const permission = await Permissions.findAll({ where: { id }});

      if (!permission) {
        throw ({message: 'Permission does not exist!'});
      }

      await permission.destroy({ where: { id }});

      return permission;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = new PermissionsService();