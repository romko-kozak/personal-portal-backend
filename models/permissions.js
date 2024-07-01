const {DataTypes} = require('sequelize');
const sequelize = require('./../config/db');

const Permissions = sequelize.define('permissions', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
}, { freezeTableName: true });

const UserPermissions = sequelize.define('users_permissions', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false }
}, { freezeTableName: true });

module.exports = {
  Permissions, UserPermissions
}