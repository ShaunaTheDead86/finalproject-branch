'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Employee, { foreignKey: "role_id", targetKey: "id"})
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    access_level: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'roles',
    modelName: 'Role',
  });
  return Role;
};
