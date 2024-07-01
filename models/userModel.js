const bcrypt = require('bcrypt');
const {DataTypes} = require('sequelize');
const sequelize = require('./../config/db');

/*
 * Models can be defined in two equivalent ways in Sequelize:
 *
 * Calling sequelize.define(modelName, attributes, options)
 * Extending Model and calling init(attributes, options)
*/

const User = sequelize.define('users', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  applicationId: { type: DataTypes.STRING, allowNull: false },
  secret: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: 'email' },
  avatar: { type: DataTypes.STRING(1000), allowNull: true },
  facebook: { type: DataTypes.STRING, allowNull: true },
  linkedIn: { type: DataTypes.STRING, allowNull: true },
  instagram: { type: DataTypes.STRING, allowNull: true },

  status: { type: DataTypes.ENUM, values: ['Pending', 'Verified', 'Denied'], defaultValue: 'Pending' },
  confirmationCode: { type: DataTypes.STRING(500), unique: 'confirmationCode' },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USER' }
}, { freezeTableName: true });

module.exports = {
  User
}