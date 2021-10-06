'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DocAuth.belongsTo(models.User)
      DocAuth.belongsTo(models.Doc)
    }
  }
  DocAuth.init({
    auth: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DocAuth',
    freezeTableName: true
  });
  return DocAuth;
};