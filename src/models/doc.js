'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doc extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doc.belongsTo(models.User, {as: "creator", foreignKey: "creatorId"})
            Doc.hasMany(models.DocAuth)
        }
    }
    Doc.init({
        uuid: DataTypes.UUID,
        name: DataTypes.STRING,
        content: DataTypes.JSONB
    }, {
        sequelize,
        modelName: 'Doc',
        freezeTableName: true
    });
    return Doc;
};