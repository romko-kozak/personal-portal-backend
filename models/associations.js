const { User } = require('./userModel');
const { Permissions, UserPermissions } = require('./permissions');

User.belongsToMany(Permissions, { through: UserPermissions });
Permissions.belongsToMany(User, { through: UserPermissions });