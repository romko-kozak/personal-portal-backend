const {User} = require('./userModel');
const {Permissions, UserPermissions} = require('./permissions');
require('./associations');

module.exports = {
  User,
  Permissions,
  UserPermissions
};